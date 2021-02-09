var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { PdfButtons };

var PdfButtons = function (_React$Component) {
  _inherits(PdfButtons, _React$Component);

  function PdfButtons(props) {
    _classCallCheck(this, PdfButtons);

    var _this = _possibleConstructorReturn(this, (PdfButtons.__proto__ || Object.getPrototypeOf(PdfButtons)).call(this, props));

    _this.onClick_PAF = function () {
      var project_id = _this.props.project_id;
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        success: function success(data) {
          console.log(data);
          var docApp = data.documentPackage.application;

          var startY = 15,
              startX = 10,
              fontSize = 12;
          var doc = new jspdf.jsPDF();
          doc.setFont("helvetica", "bold");
          doc.setFontSize(fontSize);

          var lineHeight = doc.getLineHeight(text) / doc.internal.scaleFactor;

          var d = new Date();
          var date_string = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
          var text = "CATALYST PARTNERSHIPS - PROJECT ASSESSMENT FORM - " + date_string;
          doc.text(text, startX, startY);
          doc.setFont("helvetica", "normal");
          console.log(doc.getLineHeight(text) / doc.internal.scaleFactor);
          startY += lineHeight * 2;

          var name = docApp.name.middle && docApp.name.middle.length > 0 ? docApp.name.first + " " + docApp.name.middle + " " + docApp.name.last : docApp.name.first + " " + docApp.name.last;
          if (docApp.name.preferred && docApp.name.preferred.length > 0) name += " (Preferred: " + docApp.name.preferred + ")";

          var address = docApp.address.line_1;
          if (docApp.address.line_2 && docApp.address.line_2.length > 0) {
            address += "| " + docApp.address.line_2 + "\n";
          }
          doc.text(["Name: " + name, "Address: " + address, "          " + docApp.address.city + ", " + docApp.address.state + " " + docApp.address.zip], startX, startY);
          doc.save("test.pdf");
        }
      });
    };

    return _this;
  }

  _createClass(PdfButtons, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button",
            onClick: this.onClick_PAF },
          "PAF Report"
        ),
        React.createElement(
          "button",
          { type: "button" },
          "Handle-It Report"
        )
      );
    }
  }]);

  return PdfButtons;
}(React.Component);