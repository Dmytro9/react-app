
var Note = React.createClass({
    render: function() {
        var style = { backgroundColor: this.props.color };
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}> × </span>    
                {this.props.children}
            </div>
        );
    }
});



var NoteEditor = React.createClass({
    getInitialState: function() {
        return {
            text: ''
        }
    },
    handleTextChange: function(e) {
            this.setState({text: e.target.value});
    },

    chooseColor: function(e) {
        return this.color =  e.target.value;
    },

    handleNoteAdd: function() {
        var newNote = {
            text: this.state.text,
            color: this.color,
            id: Date.now()
        };

        if (newNote.text.trim().length > 0) {
            this.props.onNoteAdd(newNote);
            this.setState({text: ''});
        } else {
            return false;
        }
    },
  

    render: function() {
        return (
            <div className="note-editor">
               <textarea 
                    placeholder='Enter your note here...' 
                    rows={5} 
                    className='textarea' 
                    value={this.state.text}
                    onChange={this.handleTextChange} 
                />
               <button className='add-button' onClick={this.handleNoteAdd}>Add</button>
               <input type="color" onChange={this.chooseColor} />
            </div>
        );
    }
});



var NotesGrid = React.createClass({
    componentDidMount: function() {
        var grid = this.refs.grid;
        this.msnry = new Masonry( grid, {
           itemSelector: '.note',   
           columnWidth: 200,
           gutter: 10,
           isFitWidth: true
        });
    },

    componentDidUpdate: function(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function() {
        var onNoteDelete = this.props.onNoteDelete; 

        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function(note){
                        return (
                            <Note
                                key={note.id}
                                color={note.color}
                                onDelete={onNoteDelete.bind(null, note)} >
                                
                                {note.text}
                            </Note>
                        );
                    })
                }
            </div>
        );
    }
});




var NotesApp = React.createClass({
    getInitialState: function() {
        return {
            notes: []
        };
    },
    
    componentDidMount: function() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({ notes: localNotes });
        }
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleNoteDelete: function(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function(note) {
            return note.id !== noteId;
        });

        this.setState({ notes: newNotes });
    },

    handleNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();
            newNotes.unshift(newNote);
            this.setState({
                notes: newNotes
            });
    },

    startSearching: function(e) {

        var searchItem = e.target.value.trim().toLowerCase();

        if (e.keyCode == 13) {

            this.setState({
                prevList: this.state.notes
            });

            var displayedNotes = this.state.notes.filter(function(note) {
                var searchNote = note.text.toLowerCase();
                return searchNote.indexOf(searchItem) !== -1;
            });

            if ( displayedNotes.length ) {
                this.setState({
                    notes: displayedNotes,
                    empty: false
                });
            } else {
                this.setState({
                    empty: true
                });
            }
        }
    },

    handleNotesBack: function(e) {
        if ( (e.target.value == "" ) && (this.state.prevList.length) ) {
            this.setState(function() {
                return {
                    notes: this.state.prevList
                }
            });
        }
    },

    render: function() {
        return (
            <div className="notes-app">
                <h2 className='app-header'>NotesApps</h2>
                <input type="text" placeholder="Search..." className="search-field" onKeyUp={this.startSearching} onChange={this.handleNotesBack} />
                <p className={ this.state.empty ? 'show' : 'hide' }>Ничего не найдено</p>
                <NoteEditor onNoteAdd={this.handleNoteAdd} />
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
            </div>
        );
    },
    
    _updateLocalStorage: function() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }

});



ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
);