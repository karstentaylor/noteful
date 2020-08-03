import React from 'react';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import NotefulContext from './NotefulContext';

class AddFolderFormView extends React.Component {
    state = {
        newfolderName: '',
        error: null
    };

    static contextType = NotefulContext;

    validateFolderName = (newFolderName) => {
        if (!newFolderName) {
            const error = 'Name must be at least 1 character long';
            this.setState({ error });
        } else {
            this.setState({ newFolderName, error: null });
        }
    };

    inputFolderName = (e) => {
        const newFolderName = e.target.value;
        this.validateFolderName(newFolderName);
    };

    addFolderRequest = (e) => {
        e.preventDefault();
        const newFolder = { name: this.state.newFolderName };
        const jsonStringifiedFolderData = JSON.stringify(newFolder);

        let error;

        fetch(`http://localhost:9090/folders`, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': jsonStringifiedFolderData
        })
            .then(response => {
                if (!response.ok) {
                    error.code = response.code;
                }
                return response.json()
            })
            .then(response => {
                if (error) {
                    error.message = response.message;
                    return Promise.reject(error);
                }
                const newFolder = {
                    id: response.id,
                    name: response.name
                }
                this.context.addFolderToUI(newFolder)
                this.props.history.push('/')
            })
            .catch(error => this.setState({ error }))
    };

    render() {
        return (
            <div className="border group-column item-double justify-content-center">
                <form className="align-self-center" onSubmit={(e) => this.addFolderRequest(e)}>
                    <label htmlFor='newFolderName'>Name:</label>
                    <input className='' id='newFolderName' name='newFolderName' onChange={(e) => this.inputFolderName(e)} type='text' required></input>
                    <button type='submit'>Add Folder</button>

                    {/* Should this be its own Component? */}
                    {this.state.error ? <p>{this.state.error}</p> : ''}

                </form>
            </div>
        );
    };
};


AddFolderFormView.propTypes = {
    history: propTypes.object
}

export default withRouter(AddFolderFormView);