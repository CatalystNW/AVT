export { PdfButtons }

class PdfButtons extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <button type="button">PAF Report</button>
        <button type="button">Handle-It Report</button>
      </div>
    )
  }
}