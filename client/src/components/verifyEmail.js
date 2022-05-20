import TextInput from "./input";
import React from 'react';

export default function Verfiy(props){
    const {formField:{code}} = props
    
    return <TextInput name = {code.name} label={code.label}></TextInput>
}