import { useState, useEffect } from 'react';
import Select from 'react-select';

function SupernovaSelection({ selectedSupernovae, onOptionChange, onTypeSelection }) {
    const [allSupernovae, setAllSupernovae] = useState([]);
    const [allTypes, setAllTypes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/all_supernovae')
            .then(response => response.json())
            .then(data => setAllSupernovae(data.map(name => ({ value: name, label: name }))))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/all_types')
            .then(response => response.json())
            .then(data => setAllTypes(data.map(name => ({ value: name, label: name }))))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="SupernovaSelection">
            <Select className="SNSelect"
                isMulti
                options={allSupernovae}
                value={selectedSupernovae.map(name => ({ value: name, label: name }))}
                onChange={onOptionChange}
                placeholder="Select Supernovae"
            />
            <Select
                isMulti
                options={allTypes}
                onChange={onTypeSelection}
                placeholder="Select by Type"
            />
        </div>
    );
}

export default SupernovaSelection;
