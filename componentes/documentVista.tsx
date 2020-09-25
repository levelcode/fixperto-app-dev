import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Constants from 'expo-constants';
import { TouchableOpacity, Text } from "react-native";
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
export default class DocumentVista extends React.Component {
	constructor(props) { super(props); this.state = { showtext: false } }
	render() {
		return (
			<TouchableOpacity onPress={this._pickFile} style={{ flexDirection: "row", alignItems: "center", borderColor: "#42AECB", borderWidth: 0.5, borderRadius: 5, backgroundColor: "#effbff", padding: 3, }}>
				<Ionicons name="ios-attach"
					style={{ marginHorizontal: 5, }} size={(this.props["icon_size"]) ? this.props["icon_size"] : 20}
					color="#42AECB"
				/>
				{(this.props["title"]) ? <Text style={{ color: "#42AECB", fontFamily: "Raleway-Bold", fontSize: 12, textAlign: "center" }}>{this.props["title"]}</Text> : null}
				{(this.state["showtext"]) ? <Text style={{ marginLeft: 5, color: "#CE4343", fontFamily: "Raleway-Bold", fontSize: 12, textAlign: "center" }}>Imagen superior a 15 megas</Text> : null}
			</TouchableOpacity>
		);
	}
	componentDidMount() { this.getPermissionAsync(); }
	getPermissionAsync = async () => {
		/*if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			//	if (status !== 'granted') { alert('No posee permiso.'); }
		}*/
	}
	_pickFile = async () => {
		if (!this.props["doc"]) {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsMultipleSelection: (this.props["multiple"]) ? true : false,
				quality: 0.7
			});
			if (!result.cancelled) { this.props["selectDocuments"](result); }
		}
		else {
			let result = await DocumentPicker.getDocumentAsync({
				copyToCacheDirectory: true,
				multiple: (this.props["multiple"]) ? true : false
			});
			if (result.type === "success"/* && (result.size / 1e+6) <= 15*/) {
				result["format"] = result["name"].split(".")[1],
					this.props["selectDocuments"](result);
				//	this.redimensionar(result);
			}
			//else { this.showtext() }*/
		}
	};
	redimensionar = async (result) => {
		let resizeObj = { width: 1024, height: 1024 };
		let manipResult = await ImageManipulator.manipulateAsync(result.uri, [{ resize: resizeObj }]);
		this.props["selectDocuments"]({
			uri: manipResult.uri, name: result["name"], width: manipResult.width, height: manipResult.height,
		});
	}
	showtext = () => { this.setState({ showtext: true }); setTimeout(() => { this.setState({ showtext: false }); }, 4000); }
}
