/* Import node modules */
import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
/* Import own modules */
import { actions } from '../../store/Store';
import Todo from '../Todo/Todo';
/* Import own css */
import './TodoPanel.css';

class TodoPanelAux extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    render() {
        return (
            <ol id={this.props.id} className={`todoList ${this.props.completed?'todoList--done':''}`}>
            { this.props.selected.tasks && 
                this.props.selected.tasks.map((value, index) => {
                    if (value.completed === this.props.completed) {
                        return <li key={index} onClick={this.clickLine.bind(this)} data-index={index}>
                                    <Todo   text={value.description} 
                                            completed={value.completed} 
                                            active={this.state.selected===index?true:false} 
                                            due={value.due}
                                            star={value.starred}
                                            starredClick={this.todoStarredClick.bind(this)}
                                            index={index}
                                    />
                                </li>
                    } else {
                       return '';
                    }
                })
            }
            </ol>
        );
    };

    clickLine(ev) {
        this.setState({ selected: parseInt(ev.currentTarget.dataset.index) });
    }

    async todoStarredClick(ev) {
        ev.preventDefault();
        try {
            let index = ev.currentTarget.dataset.index;
            if (index >= 0) {
                let todo = this.props.selected.tasks[index];
                let result = await Axios.put(`/tasklist/task/${todo._id}`, null, {
                    headers: { 'Authorization': "bearer " + this.props.user.token },
                    data: { starred: !todo.starred }
                });
                if (result.status === 200) {
                    this.props.starredTodo(index, !todo.starred);
                }
            }
        } catch (error) {
            console.log(error)
        }   
    }
}

// React-Redux
const mapState = (state) => { 
    return {
        user: state.user,
        selected: state.selected,
        switch: state.switch
    };
};
const mapActions = { 
    reloadList: actions.reloadList,
    starredTodo: actions.starredTodo,
};

const TodoPanel = connect(mapState, mapActions)(TodoPanelAux);
export default TodoPanel;