import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDebounce } from "use-debounce";
import { Supernova } from "../../lib/index";
import { useSelectedSNe } from "../../contexts/SelectedSNeContext";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import { supabase } from "../../lib/supabase";

interface SNeNameSearchProps {
    onNoData: (message: string) => void;
}

const SNeNameSearch: React.FC<SNeNameSearchProps> = ({ onNoData }) => {
    const { selectedSNe, setSelectedSNe } = useSelectedSNe();
    const { yAxisType } = usePlotSettings();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
    const [availableSNe, setAvailableSNe] = useState<Supernova[]>([]);
    const [selectedSN, setSelectedSN] = useState<Supernova | null>(null);

    useEffect(() => {
        const fetchSNNames = async () => {
            const { data, error } = await supabase
                .from("supernovae")
                .select("*")
                .order("sn_name", { ascending: true });

            if (error) {
                console.error("Error fetching supernovae names in SNeNameSearch: ", error);
            } else {
                setAvailableSNe(data || []);
            }
        };

        fetchSNNames();
    }, []);

    const handleAdd = async (event: React.SyntheticEvent, value: Supernova | null) => {
        if (value) {
            if (selectedSNe.some(sn => sn.sn_name === value.sn_name)) return;

            const { data: lightCurvesData, error: lightCurvesError } = await supabase
                .from("light_curves")
                .select("*")
                .eq("sn_id", value.sn_id)
                .limit(1);

            if (lightCurvesError) {
                console.error("Error checking photometry data in SNeNameSearch: ", lightCurvesError);
                onNoData(`Error checking photometry data for ${value.sn_name}. Skipping.`);
            } else if (lightCurvesData && lightCurvesData.length === 0) {
                onNoData(`No photometry data available for ${value.sn_name}. Skipping.`);
            } else {
                if (yAxisType === "absolute" && value.distance_modulus === null) {
                    onNoData(`No distance modulus available for ${value.sn_name}. Skipping.`);
                    return;
                }
                setSelectedSNe([...selectedSNe, value]);
            }

            setSelectedSN(null);
            setSearchTerm("");
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
            value={selectedSN}
            inputValue={searchTerm}
        />
    );
};

export default SNeNameSearch;