import React, { useState } from 'react';
import { useSelectedSNe } from "../../contexts/SelectedSNeContext";
import { Supernova } from "../../lib/index";

const SNePlotList: React.FC = () => {
    const { selectedSNe, setSelectedSNe } = useSelectedSNe();
    const [hoveredSn, setHoveredSn] = useState<number | null>(null);

    const handleClick = (sn_id: number) => {
        setSelectedSNe(selectedSNe.filter(sn => sn.sn_id !== sn_id));
    };

    return (
        <div>
            <h2>Selected Supernovae</h2>
            <ul>
                {selectedSNe.map((sn: Supernova) => (
                    <li
                        key={sn.sn_id}
                        style={{
                            cursor: 'pointer',
                            color: hoveredSn === sn.sn_id ? 'grey' : 'inherit',
                            textDecoration: hoveredSn === sn.sn_id ? 'line-through' : 'none',
                        }}
                        onMouseEnter={() => setHoveredSn(sn.sn_id)}
                        onMouseLeave={() => setHoveredSn(null)}
                        onClick={() => handleClick(sn.sn_id)}
                    >
                        {sn.sn_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SNePlotList;