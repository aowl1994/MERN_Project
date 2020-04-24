import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component{
    state = {
        text: ""
    };

    handleChange = (e)=>{
        const newText = e.target.value;
        this.setState({
            text: newText
        });
    };

    handleKeyDown = (e) => {
        console.log(e);
        if (e.key === "enter"){
            this.props.submit(this.state.text);
            this.setState({text:""});
        }
    };


    render() {
        const {text} = this.state;

        return (
        <TextField 
        onChange={this.handleChange} 
        label="todo..." 
        margin = "normal" 
        value={text} 
        fullWidth
        />
        );
    }
}