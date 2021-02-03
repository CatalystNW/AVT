class PartnerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      partners: [],
      allPartners: [],
      status: "show_current_partners"
    };
  }

  loadPartners = () => {

  };

  loadAllPartners = () => {
    $.ajax({
      url: "/app_project/partners",
      type: "GET",
      context: this,
      success: function(partnersData) {
        console.log(partnersData)
        this.setState({
          allPartners: partnersData,
        })
      },
    });
  };

  change_status = () => {
    let new_status = (this.state.status == "show_current_partners") ?
              "show_all_partners" : "show_current_partners";
    if (new_status == "show_all_partners") {
      this.loadAllPartners();
    }
    this.setState({
      status: new_status,
    });
  }

  submitNewPartners = () => {
    let inputs = document.querySelectorAll("input[name=partnerId]:checked")
    const selectedPartners = [];
    let id, index;
    for (let i=0; i<inputs.length; i++) {
      id = inputs[i].value;
      index = inputs[i].getAttribute("index");
      selectedPartners.push(
        this.state.allPartners[index]
      );
    }
    this.setState({partners: selectedPartners});
    this.change_status();
  };

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
              return (<tr key={"current-" + partner._id}>
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
        onClick={this.submitNewPartners}>Submit</button>
      <button type="button" className="btn btn-sm"
        onClick={this.change_status}>Cancel</button>
      <h3>Available Partners</h3>
      <table>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Contact</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {this.state.allPartners.map((partner,index) => {
              return (<tr key={"all-" + partner._id}>
                <td>
                  <input type="checkbox" index={index}
                    value={partner._id} name="partnerId"></input>
                </td>
                <td>{partner.org_name}</td>
                <td>{partner.org_address}</td>
                <td>{partner.contact_name}</td>
                <td>{partner.contact_email}</td>
                <td>{partner.contact_phone}</td>
              </tr>);
            })}
          </tbody>
        </table>
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