class PartnerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      partners: [],
      status: "show_current_partners"
    };
  }

  loadPartners = () => {

  };

  loadAllPartners = () => {

  };

  change_status = () => {
    let new_status = (this.state.status == "show_current_partners") ?
              "show_all_partners" : "show_current_partners";
    this.setState({
      status: new_status,
    });
  }

  show_current_partners = () => {
    return (
      <div>
        <button type="button" className="btn btn-sm"
          onClick={this.change_status}>Add Partner</button>
        <h3>Current Partners</h3>
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
            </tr>
          </thead>
          <tbody>
            {this.state.partners.map((partner,index) => {
              return (<tr>
                <td>{partner._id}</td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>);
  }
  show_all_partners = () => {
    return (
    <div>
      <button type="button" className="btn btn-sm"
        onClick={this.change_status}>Submit</button>
      <h3>Available Partners</h3>
    </div>);
  }
  
  render() {
    if (this.state.status == "show_all_partners") {
      return (this.show_all_partners());
    } else {
      return (this.show_current_partners());
    }
  }
}