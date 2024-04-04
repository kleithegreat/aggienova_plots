import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDebounce } from 'use-debounce';
import { Supernova } from '../lib/index';
import { useSelectedSNe } from '../lib/SelectedSNeContext';
import { supabase } from '../lib/supabase';

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

    const handleAdd = (sneName: string | undefined) => {
        if (sneName) {
            const selectedSN = availableSNe.find(sn => sn.sn_name === sneName);
            if (selectedSNe.some(sn => sn.sn_name === sneName)) return
            if (selectedSN) {
                setSelectedSNe([...selectedSNe, selectedSN]);
            }
        }

        console.log('Selected SNe: ', selectedSNe);
    };

    const filteredOptions = availableSNe
        .filter((sn) => sn.sn_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        .map((sn) => ({ value: sn.sn_name, label: sn.sn_name }));

    return (
        <Select
            options={filteredOptions}
            onInputChange={(newValue) => setSearchTerm(newValue)}
            onChange={(selected) => handleAdd(selected?.value)}
            placeholder="Search by name..."
            noOptionsMessage={() => 'No supernovae found'}
            styles={{
                // Customize the styles here to match your design
            }}
        />
    );
};

export default SNeNameSearch;