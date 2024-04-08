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
            <b>Selected Supernovae:</b>
            <div className="max-h-72 overflow-y-auto">
                <ul>
                    {selectedSNe.map((sn: Supernova) => (
                        <li
                            key={sn.sn_id}
                            className={`cursor-pointer ${hoveredSn === sn.sn_id ? 'text-gray-500 line-through' : 'text-black'}`}
                            onMouseEnter={() => setHoveredSn(sn.sn_id)}
                            onMouseLeave={() => setHoveredSn(null)}
                            onClick={() => handleClick(sn.sn_id)}
                        >
                            {sn.sn_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SNePlotList;