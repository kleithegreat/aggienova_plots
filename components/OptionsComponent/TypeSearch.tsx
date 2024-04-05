import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDebounce } from 'use-debounce';
import { SnType } from '../../lib/index';
import { useSelectedSNe } from '../../contexts/SelectedSNeContext';
import { supabase } from '../../lib/supabase';

const TypeSearch: React.FC = () => {
    const { selectedSNe, setSelectedSNe } = useSelectedSNe();
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

    const filteredOptions = availableTypes
        .filter((type) => type.type_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        .map((type) => ({ value: type.type_name, label: type.type_name }));

    const handleSearch = async (type: string | undefined) => {
        if (type) {
            const selectedType = availableTypes.find((t) => t.type_name === type);
            if (selectedType) {
                const { data: supernovae, error } = await supabase
                    .from('supernovae')
                    .select('*')
                    .eq('type_id', selectedType.type_id);

                if (error) {
                    console.error('Error fetching supernovae by type in TypeSearch: ', error);
                } else {
                    setSelectedSNe([...selectedSNe, ...(supernovae || [])]);
                }
            } else {
                console.error('Selected type not found in available types');
            }
        }
    };

    return (
        <Select
            options={filteredOptions}
            onInputChange={(newValue) => setSearchTerm(newValue)}
            onChange={(selected) => handleSearch(selected?.value)}
            placeholder="Search by type..."
            noOptionsMessage={() => 'No types found'}
            isClearable={true}
            styles={{}}
        />
    );
};

export default TypeSearch;