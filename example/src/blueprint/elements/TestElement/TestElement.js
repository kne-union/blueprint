import React from 'react';
import SubElement from "@blueprint/elements/TestElement/SubElement";
import OtherSubElement from "@blueprint/elements/TestElement/OtherSubElement";

const TestElement = () => {
    return <div>
        <SubElement/>
        <OtherSubElement />
        TestElement
    </div>;
};

export default TestElement;
