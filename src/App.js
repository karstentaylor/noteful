import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header';
import ErrorView from './ErrorView';
import AddFolderFormView from './AddFolderFormView';
import AddNoteFormView from './AddNoteFormView';
import MainViewSideBar from './MainViewSideBar';
import FolderViewSideBar from './FolderViewSideBar';
import NoteViewSideBar from './NoteViewSideBar';
import MainViewMain from './MainViewMain';
import FolderViewMain from './FolderViewMain';
import NoteViewMain from './NoteViewMain';
import NotefulContext from './NotefulContext';
import NotefulErrorBoundary from './NotefulErrorBoundary';
import './App.css';

// Code could be improved with better information architecture. 
class App extends React.Component {
  state = {

    STORE: {
      folders: [],
      notes: []
    },

    error: {}

  }

  addFolderToUI = (newFolder) => {
    const newFolders = this.state.STORE.folders;
    newFolders.push(newFolder);
    this.setState({ STORE: { folders: newFolders, notes: [...this.state.STORE.notes] } });
  };

  addNoteToUI = (newNote) => {
    const newNotes = this.state.STORE.notes;
    newNotes.push(newNote);
    this.setState({ STORE: { folders: [...this.state.STORE.folders], notes: newNotes } });
  };

  deleteNoteFromUI = (noteId) => {
    const newNotes = this.state.STORE.notes.filter(note => note.id !== noteId);
    this.setState({ STORE: { folders: [...this.state.STORE.folders], notes: newNotes } });
  };

  get = () => {
    let error;
    fetch('http://localhost:9090/db')
      .then(response => {
        if (!response.ok) {
          error.code = response.statusText;
        }
        return response.json()
      })
      .then(response => {
        if (error) {
          error.message = response.message
          return Promise.reject(error)
        }
        this.setState({ STORE: response });
      })
      .catch(error => this.setState({ error }))
  }

  componentDidMount = () => {
    this.get();
  }

  render() {
    const contextValue = {
      STORE: this.state.STORE,
      addFolderToUI: this.addFolderToUI,
      addNoteToUI: this.addNoteToUI,
      deleteNoteFromUI: this.deleteNoteFromUI,
      get: this.get
    };

    if (this.state.error.message) {
      return (
        <>
          <Header />
          <main className="wrapper">
            <div className="group-row">
              <ErrorView error={this.state.error.message} />
            </div>
          </main>
        </>
      )
    }

    return (
      <>
        <Header />
        <main className="wrapper">
          <div className="group-row">


            <NotefulContext.Provider
              value={contextValue}
            >

              <NotefulErrorBoundary>
                {/* Add Form Route */}
                <Route exact path='/addFolderFormView' component={MainViewSideBar} />
                <Route exact path='/addFolderFormView' component={AddFolderFormView} />

                {/* Add Note Route */}
                <Route exact path='/addNoteFormView' component={MainViewSideBar} />
                <Route exact path='/addNoteFormView' component={AddNoteFormView} />
              </NotefulErrorBoundary>



              <NotefulErrorBoundary>
                {/* Sidebars */}
                {/* Main Route */}
                <Route exact path='/' component={MainViewSideBar} />

                {/* Dynamic Folder Route */}
                <Route exact path='/folder/:folderId' component={FolderViewSideBar} />

                {/* Dynamic Note Route */}
                <Route exact path='/note/:noteId' component={NoteViewSideBar} />
              </NotefulErrorBoundary>



              {/* <NotefulErrorBoundary> */}
              {/* Main Sections */}
              {/* Main Route */}
              <Route exact path='/' component={MainViewMain} />

              {/* Dynamic Folder Route */}
              <Route exact path='/folder/:folderId' component={FolderViewMain} />

              {/* Dynamic Note Route */}
              <Route exact path='/note/:noteId' component={NoteViewMain} />
              {/* </NotefulErrorBoundary> */}

            </NotefulContext.Provider>



          </div>
        </main>
      </>
    );
  };
};

export default App;