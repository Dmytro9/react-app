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
            notes: [],
            currentNotes: []
        };
    },

    componentDidMount: function() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        var currentNotes = JSON.parse(localStorage.getItem('currentNotes'));
        if (localNotes.length && currentNotes.length) {
            this.setState({
                notes: localNotes,
                currentNotes: currentNotes
            });
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

        this.setState({
            notes: newNotes,
            currentNotes: newNotes
        });
    },

    handleNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({
            notes: newNotes,
            currentNotes: newNotes
        });
    },

    startSearching: function(e) {

        if (e.keyCode == 13) {
            var baz = this.state.notes.slice(),
                searchItem = e.target.value.trim().toLowerCase();

            var displayedNotes = baz.filter(function(note) {
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
        if ( e.target.value == "" ) {

            var curNotes = this.state.currentNotes.slice();

                this.setState(function() {
                    return {
                        notes: curNotes,
                        empty: false
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
        var notes = JSON.stringify(this.state.notes),
            currentNotes = JSON.stringify(this.state.currentNotes);
        localStorage.setItem('notes', notes);
        localStorage.setItem('currentNotes', currentNotes);
    }

});



ReactDOM.render(
<NotesApp />,
    document.getElementById('mount-point')
);