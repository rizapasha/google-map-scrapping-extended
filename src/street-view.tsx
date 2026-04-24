import React, { useState } from 'react';

const StreetViewValidation = () => {
    const [businessDetails, setBusinessDetails] = useState({
        name: 'Business Name',
        address: 'Business Address',
        coordinates: { lat: 0, lng: 0 },
        imageUrl: 'https://via.placeholder.com/600x400',
    });
    const [validationCount, setValidationCount] = useState(0);

    const handleValidation = (isValid) => {
        if (isValid) {
            setValidationCount(validationCount + 1);
        } else {
            setValidationCount(validationCount - 1);
        }
        // Add logic to handle Valid, Invalid, and Skip actions (e.g., sending data to server)
    };

    return (
        <div>
            <h1>{businessDetails.name}</h1>
            <p>{businessDetails.address}</p>
            <p>Coordinates: ({businessDetails.coordinates.lat}, {businessDetails.coordinates.lng})</p>
            <img src={businessDetails.imageUrl} alt="Street View" style={{ width: '100%' }} />
            <div>
                <button onClick={() => handleValidation(true)}>Valid</button>
                <button onClick={() => handleValidation(false)}>Invalid</button>
                <button onClick={() => { /* Skip logic */ }}>Skip</button>
            </div>
            <p>Validation Count: {validationCount}</p>
        </div>
    );
};

export default StreetViewValidation;
