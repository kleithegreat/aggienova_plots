import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { Supernova } from '../../lib/index';
import { useSelectedSNe } from '../../contexts/SelectedSNeContext';
import { supabase } from '../../lib/supabase';

const SNeNameSearch: React.FC = () => {
    const { selectedSNe, setSelectedSNe } = useSelectedSNe();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
    const [availableSNe, setAvailableSNe] = useState<Supernova[]>([]);

    useEffect(() => {
        const fetchSNNames = async () => {
            const { data, error } = await supabase
                .from('supernovae')
                .select('*')
                .order('sn_name', { ascending: true });

            if (error) {
                console.error('Error fetching supernovae names in SNeNameSearch: ', error);
            } else {
                setAvailableSNe(data || []);
            }
        };

        fetchSNNames();
    }, []);

    const handleAdd = (event: React.SyntheticEvent, value: Supernova | null) => {
        if (value) {
            if (selectedSNe.some(sn => sn.sn_name === value.sn_name)) return;
            setSelectedSNe([...selectedSNe, value]);
        }
    };

    const filteredOptions = availableSNe.filter((sn) =>
        sn.sn_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    return (
        <Autocomplete
            options={filteredOptions}
            getOptionLabel={(option) => option.sn_name}
            renderInput={(params) => (
                <TextField {...params} label="Search by name..." variant="outlined" />
            )}
            onInputChange={(event, newValue) => setSearchTerm(newValue)}
            onChange={handleAdd}
            noOptionsText="No supernovae found"
            clearOnBlur
        />
    );
};

export default SNeNameSearch;