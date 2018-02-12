import React from 'react';
import uuid from 'uuid';

import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});

function activeThreadIdReducer(state = '1-fca2', action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
}

function findThreadIndex(threads, action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      return threads.findIndex(
        (thread) => thread.id === action.threadId
      );
    }
    case 'DELETE_MESSAGE': {
      return threads.findIndex(
        (thread) => thread.messages.find(message => (message.id === action.id))
      );
    }
    default: {
      return threads;
    }
  }
}

function messagesReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4(),
      };
      return state.concat(newMessage);
    }
    case 'DELETE_MESSAGE': {
      return state.filter(message => message.id !== action.id);
    }
    default: {
      return state;
    }
  }
}

function threadsReducer(state = [
    {
      id: '1-fca2', // hardcoded pseudo-UUID
      title: 'Buzz Aldrin',
      messages: messagesReducer(undefined, {})
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: messagesReducer(undefined, {}),
    },
  ], action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE': {
      const threadIndex = findThreadIndex(state, action);

      const oldThread = state[threadIndex];
      const newThread = {
        ...oldThread, // copy all of the properties from oldThread to newThread:
        messages: messagesReducer(oldThread.messages, action),
      };

      return [
        ...state.slice(0, threadIndex), // up to the thread
        newThread,                      // insert the new thread object
        ...state.slice(
          threadIndex + 1, state.length // after the thread
        ),
      ];
    }
    default: {
      return state;
    }
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function deleteMessage(id) {
  return {
    type: 'DELETE_MESSAGE',
    id: id,
  };
}

function addMessage(text, threadId) {
  return {
    type: 'ADD_MESSAGE',
    text: text,
    threadId: threadId,
  };
}

function openThread(id) {
  return {
    type: 'OPEN_THREAD',
    id: id,
  };
}


const App = () => (
  <div className='ui segment'>
    <ThreadTabs />
    <ThreadDisplay />
  </div>
);

const Tabs = (props) => (
  <div className='ui top attached tabular menu'>
    {
      props.tabs.map((tab, index) => (
        <div
          key={index}
          className={tab.active ? 'active item' : 'item'}
          onClick={() => props.onClick(tab.id)}
        >
          {tab.title}
        </div>
      ))
    }
  </div>
);

const mapStateToTabsProps = (state) => {
  const tabs = state.threads.map(thread => (
    {
      title: thread.title,
      active: thread.id === state.activeThreadId,
      id: thread.id,
    }
  ));

  return {
    tabs,
  };
};

const mapDispatchToTabsProps = (dispatch) => (
  {
    onClick: (id) => (
      dispatch(openThread(id))
    ),
  }
);

const ThreadTabs = connect(
  mapStateToTabsProps,
  mapDispatchToTabsProps
)(Tabs);

class TextFieldSubmit extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.value);
    this.setState({
      value: '',
    });
  };

  render() {
    return (
      <div className='ui input'>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
      </div>
    );
  }
}

const MessageList = (props) => (
  <div className="ui comments">
    {
      props.messages.map((message, index) => (
        <div
          className="comment"
          key={index}
          onClick={() => props.onClick(message.id)}
        >
          <div className="text">
            {message.text}
            <span className="metadata">@{message.timestamp}</span>
          </div>
        </div>
      ))
    }
  </div>
);

const Thread = (props) => (
  <div className='ui center aligned basic segment'>
    <MessageList
      messages={props.thread.messages}
      onClick={props.onMessageClick}
    />
    <TextFieldSubmit
      onSubmit={props.onMessageSubmit}
    />
  </div>
);

const mapStateToThreadProps = (state) => (
  { // return an object that maps the thread property to active thread in state:
    thread: state.threads.find(
      thread => thread.id === state.activeThreadId
    ),
  }
);

const mapDispatchToThreadProps = (dispatch) => (
  {
    onMessageClick: (id) => (
      dispatch(deleteMessage(id))
    ),
    dispatch: dispatch,
  }
);

const mergeThreadProps = (stateProps, dispatchProps) => (
  {
    ...stateProps,
    ...dispatchProps,
    onMessageSubmit: (text) => (
      dispatchProps.dispatch(
        addMessage(text, stateProps.thread.id)
      )
    ),
  }
);

const ThreadDisplay = connect(
  mapStateToThreadProps,
  mapDispatchToThreadProps,
  mergeThreadProps
)(Thread);

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
