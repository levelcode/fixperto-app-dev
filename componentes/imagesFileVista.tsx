import * as React from 'react';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class ImagesFileVista extends React.Component {
	render() {
		return (
			<Button type="outline" buttonStyle={{ borderColor: "#42AECB", padding: 3 }}
				titleStyle={{ color: "#42AECB", fontFamily: "Raleway-Bold", fontSize: 12 }} title={(this.props["title"]) ? this.props["title"] : ""}
				icon={<Ionicons name="ios-attach" style={{ marginHorizontal: 5 }} size={(this.props["icon_size"]) ? this.props["icon_size"] : 20} color="#42AECB" />}
				onPress={this._pickImageFile}
			/>
		);
	}

	componentDidMount() { this.getPermissionAsync(); }

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('No posee permisos');
			}
		}
	}

	_pickImageFile = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsMultipleSelection: (this.props["multiple"]) ? true : false,
			quality: 1
		});
		if (!result.cancelled) {
			this.props["addImage"](result["uri"]);
		}
	};
}