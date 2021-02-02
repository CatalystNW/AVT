class PartnerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      partners: [],
    };
  }

  loadPartners = () => {

  };

  loadAllPartners = () => {

  };
  
  render() {
    return (
    <div>
      <button type="button" className="btn btn-sm">Add Partner</button>
      <h3>Partners</h3>
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
}