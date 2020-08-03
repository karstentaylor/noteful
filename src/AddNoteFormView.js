import React from 'react';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import NotefulContext from './NotefulContext';

class AddNoteFormView extends React.Component {
    state = {
        newNoteName: '',
        newNoteContent: '',
        folderId: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1',
        error: null
    };

    static contextType = NotefulContext;

    // Validation Handlers

    validateNoteName = (newNoteName) => {
        if (!newNoteName) {
            const error = 'Name must have at least 1 character'
            this.setState({ error })
        } else {
            this.setState({ newNoteName, error: null });
        }
    };

    validateNoteContent = (newNoteContent) => {
        if (!newNoteContent) {
            const error = 'Name must have at least 1 character'
            this.setState({ error })
        } else {
            this.setState({ newNoteContent, error: null });
        }
    };

    // Event Handlers

    inputNoteName = (e) => {
        const newNoteName = e.target.value;
        this.validateNoteName(newNoteName);
    };

    inputNoteContent = (e) => {
        const newNoteContent = e.target.value;
        this.validateNoteContent(newNoteContent);
    };

    inputNoteFolderId = (e) => {
        const folderId = e.target.value;
        this.setState({ folderId });
    };

    // Network Request

    addNoteRequest = (e) => {
        e.preventDefault();

        const dateNoteModifiedObj = new Date();
        const dateNoteModified = dateNoteModifiedObj.toDateString();

        const newNote = {
            name: this.state.newNoteName,
            content: this.state.newNoteContent,
            folderId: this.state.folderId,
            modified: dateNoteModified
        };

        const jsonStringifiedNote = JSON.stringify(newNote);

        const settings = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': jsonStringifiedNote
        };

        let error;
        fetch(`http://localhost:9090/notes`, settings)
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
                const newNote = {
                    id: response.id,
                    name: response.name,
                    content: response.content,
                    folderId: response.folderId,
                    modified: response.modified
                }
                this.context.addNoteToUI(newNote)
                this.props.history.push(`/folder/${response.folderId}`)
            })
            .catch(error => this.setState({ error }))
    };

    render() {
        const folderOptions = this.context.STORE.folders.map(folder =>
            folder.name ? <option key={folder.id} value={folder.id}>{folder.name}</option> : ''
        );
        return (
            <div className="border group-column item-double justify-content-center">

                <form className="align-self-center group-column" onSubmit={(e) => this.addNoteRequest(e)}>

                    <label htmlFor='newNoteName'>Name:</label>
                    <input className='' id='newNoteName' name='newNoteName' onChange={(e) => this.inputNoteName(e)} placeholder='Name' type='text' required></input>

                    <label htmlFor='newNoteContent'>Content:</label>
                    <textarea name='newNoteContent' onChange={(e) => this.inputNoteContent(e)} placeholder='Content' required></textarea>

                    <label htmlFor='newNoteFolder'>Folder:</label>
                    <select id='newNoteFolder' onChange={(e) => this.inputNoteFolderId(e)}>
                        {folderOptions}
                    </select>

                    <button type='submit'>Add Note</button>

                    {this.state.error ? <p>{this.state.error}</p> : ''}
                </form>

            </div>
        );
    };
};

AddNoteFormView.propTypes = {
    history: propTypes.object
}

export default withRouter(AddNoteFormView);