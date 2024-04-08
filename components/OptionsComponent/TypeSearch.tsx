import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { SnType, Supernova } from '../../lib/index';
import { useSelectedSNe } from '../../contexts/SelectedSNeContext';
import { usePlotSettings } from '../../contexts/PlotSettingsContext';
import { supabase } from '../../lib/supabase';

interface TypeSearchProps {
    onNoData: (message: string) => void;
}

const TypeSearch: React.FC<TypeSearchProps> = ({ onNoData }) => {
    const { selectedSNe, setSelectedSNe } = useSelectedSNe();
    const { yAxisType } = usePlotSettings();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
    const [availableTypes, setAvailableTypes] = useState<SnType[]>([]);

    useEffect(() => {
        const fetchTypes = async () => {
            const { data, error } = await supabase
                .from('sn_types')
                .select('*')
                .order('type_name', { ascending: true });

            if (error) {
                console.error('Error fetching SN types in TypeSearch: ', error);
            } else {
                setAvailableTypes(data || []);
            }
        };

        fetchTypes();
    }, []);

    const filteredOptions = availableTypes.filter((type) =>
        type.type_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const handleSearch = async (event: React.SyntheticEvent, value: SnType | null) => {
        if (value) {
            const { data: supernovae, error } = await supabase
                .from('supernovae')
                .select('*')
                .eq('type_id', value.type_id);

            if (error) {
                console.error('Error fetching supernovae by type in TypeSearch: ', error);
            } else {
                const filteredSupernovae = await Promise.all(
                    (supernovae || []).map(async (sn: Supernova) => {
                        const { data: lightCurvesData, error: lightCurvesError } = await supabase
                            .from('light_curves')
                            .select('*')
                            .eq('sn_id', sn.sn_id)
                            .limit(1);

                        if (lightCurvesError) {
                            console.error('Error checking photometry data in TypeSearch: ', lightCurvesError);
                            onNoData(`Error checking photometry data for ${sn.sn_name}. Skipping.`);
                            return null;
                        } else if (lightCurvesData && lightCurvesData.length === 0) {
                            onNoData(`No photometry data available for ${sn.sn_name}. Skipping.`);
                            return null;
                        } else {
                            if (yAxisType === 'absolute' && sn.distance_modulus === null) {
                                onNoData(`No distance modulus available for ${sn.sn_name}. Skipping.`);
                                return null;
                            }
                            return sn;
                        }
                    })
                );

                const validSupernovae = filteredSupernovae.filter((sn) => sn !== null) as Supernova[];
                setSelectedSNe([...selectedSNe, ...validSupernovae]);
            }
        }
    };

    return (
        <Autocomplete
            options={filteredOptions}
            getOptionLabel={(option) => option.type_name}
            renderInput={(params) => (
                <TextField {...params} label="Search by type..." variant="outlined" />
            )}
            onInputChange={(event, newValue) => setSearchTerm(newValue)}
            onChange={handleSearch}
            noOptionsText="No types found"
            clearOnBlur
        />
    );
};

export default TypeSearch;