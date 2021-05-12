export { PartnersReport }

import { functionHelper } from "../functionHelper.js"

class PartnersReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partners: [],
      showPartnerProjects: new Set(),
    };
  }

  getPartners = () => {
    $.ajax({
      url: "/app_project/report/partners",
      type: "GET",
      context: this,
      success: function(data) {
        console.log(data);
        const partnersDict = {};
        const partnersData = data.partners,
              projectsData = data.projects;
        let i;
        for (i=0; i<partnersData.length; i++) {
          partnersDict[partnersData[i]._id] = partnersData[i];
          partnersDict[partnersData[i]._id].projects = [];
        }

        for (i=0; i<projectsData.length; i++) {
          projectsData[i].partners.forEach(partner => {
            if (partner in partnersDict) {
              partnersDict[partner].projects.push(projectsData[i]);
            }
          });
        }
        let partners = Object.values(partnersDict);
        // Sort the partners by org_name
        partners.sort((a, b) => {
          var nameA = a.org_name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.org_name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;

        });
        this.setState({
          partners: partners,
        });
      }
    });
  };

  onClick_partnersRow = (e) => {
    const partnerId = e.target.value;
    this.setState(state => {
      let newShowPartnerProjects = new Set(this.state.showPartnerProjects);
      if (newShowPartnerProjects.has(partnerId)) {
        newShowPartnerProjects.delete(partnerId);
      } else {
        newShowPartnerProjects.add(partnerId)
      }
      return {
        showPartnerProjects: newShowPartnerProjects,
      };
    })
    
  };

  createPartnersTable = () => {
    let partners = this.state.partners, 
        i, tr;

    const rows = [];
    console.log(partners);
    for (i=0; i<partners.length; i++) {
      tr = (<tr key={partners[i]._id}>
        <td>{partners[i].org_name}</td>
        <td>{partners[i].org_address}</td>
        <td>{partners[i].contact_phone}</td>
        <td>{partners[i].contact_email}</td>
        <td>
          <button className="btn btn-outline-primary btn-sm"
              value={partners[i]._id}
              onClick={this.onClick_partnersRow}>
            {partners[i].projects.length}</button>
        </td>
      </tr>);
      rows.push(tr);

      if (this.state.showPartnerProjects.has(partners[i]._id)) {
        partners[i].projects.forEach(project => {
          rows.push(
            <tr className="project-partner-row"
                key={"proj-" + partners[i]._id + "-" + project._id}>
              <th>Project Name</th>
              <td>
                <a href={"/app_project/view_projects/" + project._id}>{project.name && project.name.length > 0 ?
                      project.name : "N/A"}</a></td>
              <th>Status</th>
              <td>{project.status}</td>
              <td>{ (project.start) ? 
                    functionHelper.convert_date(project.start).toLocaleDateString() : 
                    "None"}</td>
            </tr>);
        });
      }
    }
    return (<table className="table table-sm">
      <thead>
        <tr>
          <th scope="col">Organization</th>
          <th scope="col">Address</th>
          <th scope="col">Phone</th>
          <th scope="col">Email</th>
          <th scope="col"># Projects</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>);
  };

  render() {
    return (
    <div>
      {this.createPartnersTable()}
    </div>);
  }
}