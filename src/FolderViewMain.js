import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import propTypes from 'prop-types';
import NotefulContext from './NotefulContext';

class FolderViewMain extends React.Component {
    static contextType = NotefulContext;

    deleteNoteRequest = (noteId) => {
        fetch(`http://localhost:9090/notes/${noteId}`, { 'method': 'DELETE' })
            .then(response => response.json())
            .then(response => this.context.deleteNoteFromUI(noteId))
            .then(this.props.history.push('/'))
    };

    render = () => {
        const notes = this.context.STORE.notes.filter(note => note.folderId === this.props.match.params.folderId).map(note => {
            let dateNoteModifiedObj = new Date(note.modified);
            let dateNoteModified = dateNoteModifiedObj.toDateString();
            return (
                <section className="border group-column note-margin note-padding width" key={note.id}>
                    <h2><Link to={`/note/${note.id}`}>Name: {note.name}</Link></h2>
                    <div className="group-row note-group-row">
                        <p>Date modified on: {dateNoteModified}</p>
                        <button onClick={() => this.deleteNoteRequest(note.id, this.context.deleteNoteFromUI)}>Delete Note</button>
                    </div>
                </section>
            );
        });

        return (
            <section className="border group-column item-double">
                {notes}
            </section>
        );
    }
}

FolderViewMain.propTypes = {
    history: propTypes.object,
    match: propTypes.object
}

export default withRouter(FolderViewMain);