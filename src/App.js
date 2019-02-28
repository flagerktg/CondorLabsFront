import React, {
    Component
} from 'react';
import Select from 'react-select';

const optionsStates = [{
        value: 'Open',
        label: 'Open'
    },
    {
        value: 'InProgress',
        label: 'InProgress'
    },
    {
        value: 'Completed',
        label: 'Completed'
    },
    {
        value: 'Archived',
        label: 'Archived'
    }

];
var userOptions = []
const URL = 'http://localhost:8080/api/';
const users = [];

class App extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            description: '',
            user: "",
            userSelected: "",
            statusSelected: "",
            status: "",
            users: [],
            tasks: [],
            _id: '',
            userName: '',
            userPhone: '',
        }
        this.addTask = this.addTask.bind(this);
        this.addUser = this.addUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //in this function the tasks are added and implicitly also the task update.
    addTask(e) {
        if (this.state._id) {
            //in this case is for update one task by Id
            fetch(`${URL}task/${this.state._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(this.state),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.clearTaskFields();
                    this.fetchTasks();
                })
        } else {
            //here we add the task
            fetch(`${URL}task`, {
                    method: 'POST',
                    body: JSON.stringify(this.state),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {

                    this.clearTaskFields();
                    this.fetchTasks();
                })
                .catch(err => console.error(err));
        }

        e.preventDefault();
    }
    //Adding a new User
    addUser(e) {
        fetch(`${URL}user`, {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    userName: '',
                    userPhone: '',
                });
                this.fetchUsers();

            })
            .catch(err => console.error(err));

        e.preventDefault();
    }
    componentDidMount() {
        this.fetchTasks();
        this.fetchUsers()
    }
    //update the users list
    fetchUsers() {
        fetch(`${URL}user`)
            .then(res => res.json()).then(data => {
                if (users.length > 1) {
                    users.push(data[data.length - 1])
                    userOptions.push({
                        value: users[users.length - 1].userName,
                        label: users[users.length - 1].userName
                    });

                } else {

                    userOptions = data.map(x => {
                        return {
                            value: x.userName,
                            label: x.userName
                        }
                    })
                }
                this.setState({
                    users: data
                })
            });
    }
    //update the tasks list
    fetchTasks() {
        fetch(`${URL}task`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    tasks: data
                })
            });
    }
    clearTaskFields() {
        this.setState({
            name: '',
            description: '',
            status: '',
            user: '',
            _id: '',
            userSelected: "",
            statusSelected: "",
        });
    }
    //delete task by id
    deleteTask(id) {
        if (window.confirm('Are you sure you want to delete it?')) {
            fetch(`${URL}task/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.fetchTasks();
                });
        }
    }
    //in this case we fill in the fields to edit the task
    editTask(id) {
        fetch(`${URL}task/${id}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    name: data.name,
                    description: data.description,
                    user: data.user,
                    status: data.status,
                    _id: data._id,
                    userSelected: '',
                    statusSelected: '',

                })
            });
    }

    handleChange(e) {
        const {
            name,
            value
        } = e.target;
        this.setState({
            [name]: value
        });
    }
    //Select for the tasks status 
    changeTaskState = (statusSelected) => {
        this.setState({
            statusSelected
        })
        this.state.status = statusSelected.value;

    }
    //select for registered users
    changeUser = (userSelected) => {
        this.setState({
            userSelected
        })
        this.state.user = userSelected.value;
    }
    render(){
        const { statusSelected } = this.state;
        const { userSelected } = this.state;
        return(
            <h1>
                {/*NAVIGATION*/}
                <nav className="light-blue darken-4">
                    <div className="container">
                        <a className="brand-logo" href="">MY TO DO LIST</a>
                    </div>
                </nav>

                <div className="container">
                    <div className="row">
                         <div className="col s5">
                            <div className="card">
                                <div className="card-content">
                                <style>{`
                                            div.card{
                                            font-size: 20px;
                                            }
                                            `}</style>
                                            TASK REGISTER
                                    <form onSubmit={this.addTask}>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input name="name" onChange={this.handleChange} type="text" placeholder="Task Name" value={this.state.name}/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea name="description" onChange={this.handleChange} placeholder="Task Description" className="materialize-textarea" value={this.state.description}></textarea>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">User
                                    {<Select
                                            name="User" 
                                            value={userSelected}
                                            onChange={this.changeUser}
                                            options={userOptions}
                                            />}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">Status
                                    {<Select
                                            name="taskState" 
                                            value={statusSelected}
                                            onChange={this.changeTaskState}
                                            options={optionsStates}
                                            />}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn light-blue darken-4">
                                        Send
                                    </button>
                                    </form>
                                </div>
                                
                            </div>
                            
                        </div>
                        <div className="col s5">
                        <div className="card">
                            <div className="card-content">USER REGISTER
                                    <form onSubmit={this.addUser}>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input name="userName" onChange={this.handleChange} type="text" placeholder="User Name" value={this.state.userName}/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea name="userPhone" onChange={this.handleChange} placeholder="User Phone" className="materialize-textarea" value={this.state.userPhone}></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn light-blue darken-4">
                                        Send
                                    </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col 7">Tasks
                            <table>
                                <thead>
                                    <tr>
                                    <style>{`
                                            table{
                                            font-size: 20px;
                                            }
                                            `}</style>
                                    <td>Name</td>
                                    <td>Description</td>
                                    <td>User</td>
                                    <td>State</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.tasks.map(task=>{
                                            return (
                                                <tr key={task._id}>
                                                    <td>{task.name}</td>
                                                    <td>{task.description}</td>
                                                    <td>{task.user}</td>
                                                    <td>{task.status}</td>
                                                    <td>
                                                        <button className="btn light-blue darken-4" onClick={()=>this.editTask(task._id)}>
                                                            <i className="material-icons">edit</i>
                                                        </button>
                                                        <button className="btn light-blue darken-4" onClick={()=>this.deleteTask(task._id)} style={{margin:'4px'}}>
                                                            <i className="material-icons">delete</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="col 7"> Users
                            <table>
                                <thead>
                                    <tr>
                                    <style>{`
                                            table{
                                            font-size: 20px;
                                            }
                                            `}</style>
                                    <td>Name</td>
                                    <td>User Phone</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.users.map(user=>{
                                            return (
                                                <tr key={user._id}>
                                                    <td>{user.userName}</td>
                                                    <td>{user.userPhone}</td>
                                                    {/* <td>
                                                        <button className="btn light-blue darken-4" onClick={()=>this.editUser(user._id)}>
                                                            <i className="material-icons">edit</i>
                                                        </button>
                                                        <button className="btn light-blue darken-4" onClick={()=>this.deleteUser(user._id)} style={{margin:'4px'}}>
                                                            <i className="material-icons">delete</i>
                                                        </button>
                                                    </td> */
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                </div>

            </h1>
        )
    }
}

export default  App;