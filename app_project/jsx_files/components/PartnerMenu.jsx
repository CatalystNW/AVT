class PartnerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      partners: this.props.partners,
      allPartners: [],
      checkedId_AllPartners: [],
      status: "show_current_partners"
    };
  }

  loadAllPartners = () => {
    $.ajax({
      url: "/app_project/partners",
      type: "GET",
      context: this,
      success: function(partnersData) {
        console.log(partnersData)
        
        // Set checkedId_AllPartners to true/false if selected
        let selectedPartners = this.state.partners;
        let partnerSet = new Set();
        for (let i=0; i<selectedPartners.length; i++) {
          partnerSet.add(selectedPartners[i]._id);
        }
        var checkedId_AllPartners = partnersData.map(
          (partner) => {
            return partnerSet.has(partner._id);
          });

        this.setState({
          allPartners: partnersData,
          checkedId_AllPartners: checkedId_AllPartners,
        });
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
    const selectedPartners = [],
          selectedPartnerIds = [], 
          checkedId_AllPartners = this.state.allPartners.map(()=>{ return false;});
    let id, index;
    for (let i=0; i<inputs.length; i++) {
      id = inputs[i].value;
      index = inputs[i].getAttribute("index");
      selectedPartners.push(
        this.state.allPartners[index]
      );
      selectedPartnerIds.push(
        this.state.allPartners[index]._id
      );
      checkedId_AllPartners[index] = true;
    }

    if (this.props.type == "project") {
      $.ajax({
        url: "/app_project/projects/" + this.props.project_id + "/partners",
        type: "PATCH",
        data: {
          selectedPartnerIds: selectedPartnerIds,
        },
        context: this,
        success: function(data) {
          this.setState({
            partners: selectedPartners,
            checkedId_AllPartners: checkedId_AllPartners,
          });
        }
      });
    }

    this.change_status();
  };

  onClick_editPartner = () => {
    console.log("edit");
  };
  onClick_createPartner = () => {
    this.props.set_create_partner_menu(
      {type: "project", project_id: this.props.project_id, },
      funkie.create_partner,
      (createdPartner) => {
        this.setState(state=> {
          let new_allPartners = [...state.allPartners, createdPartner];
          let new_checkedId = [...state.checkedId_AllPartners, false];
          return {
            allPartners: new_allPartners,
            checkedId_AllPartners: new_checkedId,
          };
        });
      }
    );
  }
  onClick_deletePartner = () => {
    console.log("delete");
  };

  selectRow = (e) => {
    let element = e.target;
    for (let i=0; i<5; i++) { // Limit search to 5 elements
      if (element.tagName == "TR") {
        break;
      }
      element = element.parentNode;
    }
    const index = element.getAttribute("index");
    this.setState(state => {
      const new_checkedId_AllPartners =  [...state.checkedId_AllPartners];
      new_checkedId_AllPartners[index] = !state.checkedId_AllPartners[index];
      return { checkedId_AllPartners: new_checkedId_AllPartners }
    });
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
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Contact</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>
            {this.state.partners.map((partner,index) => {
              return (<tr key={"current-" + partner._id}>
                <td>{partner.org_name}</td>
                <td>{partner.org_address}</td>
                <td>{partner.contact_name}</td>
                <td>{partner.contact_email}</td>
                <td>{partner.contact_phone}</td>
                <td>
                  <button type="button" className="btn btn-sm"
                    onClick={this.onClick_editPartner}>Edit</button>
                  <button type="button" className="btn btn-sm"
                    onClick={this.onClick_deletePartner}>Delete</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>);
  };

  show_all_partners = () => {
    return (
    <div>
      <button type="button" className="btn btn-sm"
        onClick={this.submitNewPartners}>Submit</button>
      <button type="button" className="btn btn-sm"
        onClick={this.change_status}>Cancel</button>
      <button type="button" className="btn btn-sm"
        onClick={this.onClick_createPartner}>Create Partner</button>
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
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>
            {this.state.allPartners.map((partner,index) => {
              return (
              <tr key={"all-" + partner._id} index={index} onClick={this.selectRow}>
                <td>
                  <input type="checkbox" index={index}
                    value={partner._id} name="partnerId"
                    onChange={this.selectRow}
                    checked={this.state.checkedId_AllPartners[index]}
                  ></input>
                </td>
                <td>{partner.org_name}</td>
                <td>{partner.org_address}</td>
                <td>{partner.contact_name}</td>
                <td>{partner.contact_email}</td>
                <td>{partner.contact_phone}</td>
                <td>
                  <button type="button" className="btn btn-sm"
                    onClick={this.onClick_editPartner}>Edit</button>
                  <button type="button" className="btn btn-sm"
                    onClick={this.onClick_deletePartner}>Delete</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
    </div>);
  };
  
  render() {
    if (this.state.status == "show_all_partners") {
      return (this.show_all_partners());
    } else {
      return (this.show_current_partners());
    }
  }
}