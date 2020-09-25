import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Platform, FlatList } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Image } from 'react-native-elements';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
export default class CameraVista extends Component {
	camera = null;
	state = { hasPermission: null, cameraType: Camera.Constants.Type.back, photos: [] }
	async componentDidMount() { this.getPermissionAsync() }
	getPermissionAsync = async () => {
		if (Platform.OS === 'ios') {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') { alert('Es necesario subir una foto, ya que una imagen bien encuadrada puede ayudarte a generar mayor confianza entre tus clientes'); }
			this.setState({ hasPermission: status === 'granted' });
		}
		else {
			const { status } = await Permissions.askAsync(Permissions.CAMERA);
			if (status !== 'granted') { alert('Es necesario subir una foto, ya que una imagen bien encuadrada puede ayudarte a generar mayor confianza entre tus clientes'); }
			this.setState({ hasPermission: status === 'granted' });
		}
	}
	takePicture = async () => {
		if (this.camera) {
			let photo = await this.camera.takePictureAsync();
			this.setState(prevState => ({
				photos: (this.props["navigation"].getParam("multiple")) ? [...prevState["photos"], { uri: photo.uri }] : [{ uri: photo.uri }]
			}));
		}
	}
	handleCameraType = () => {
		const { cameraType } = this.state;
		this.setState({
			cameraType: cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
		})
	}
	deletePhoto(photo) {
		let photos = this.state.photos;
		var i = photos.indexOf(photo);
		if (i !== -1) { photos.splice(i, 1); }
		this.setState({ photos: (photos.length > 0) ? photos : [] });
	}
	keyExtractor = (item, index) => index.toString()
	render() {
		const { hasPermission } = this.state;
		const { photos } = this.state;
		if (hasPermission === null) {
			return <View />;
		} else if (hasPermission === false) {
			return <Text>No hay acceso a la cámara</Text>;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<Camera style={{ flex: 1 }} type={this.state.cameraType} ref={ref => { this.camera = ref; }}>
						<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 20 }}>
							<TouchableOpacity
								style={{ alignSelf: 'flex-end', alignItems: 'center', backgroundColor: 'transparent', }}
								onPress={() => { this.takePicture() }} >
								<FontAwesome name="camera" style={{ color: "#42AECB", fontSize: 40 }} />
							</TouchableOpacity>
							<TouchableOpacity
								style={{ alignSelf: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}
								onPress={() => { this.handleCameraType() }}	>
								<MaterialCommunityIcons name="camera-switch" style={{ color: "#42AECB", fontSize: 40 }} />
							</TouchableOpacity>
						</View>
					</Camera>
					<View style={{ marginTop: 10, marginHorizontal: 10, display: (photos.length) ? "flex" : "none" }}>
						<FlatList horizontal data={photos}
							renderItem={({ item }) => <Image source={{ uri: item.uri }} style={{ marginStart: 15, width: 80, height: 80 }}>
								<Ionicons name="ios-close-circle" color="#CE4343" size={20}
									style={{ position: 'absolute', right: 8, top: -3 }} onPress={() => { this.deletePhoto(item) }} />
							</Image>
							}
							keyExtractor={this.keyExtractor}
						/>
						<Button title="Aceptar" buttonStyle={{ backgroundColor: "#42AECB", marginHorizontal: 20, marginVertical: 10 }}
							onPress={() => {
								this.props["navigation"].navigate(this.props["navigation"].getParam("ruta"), { photos: this.state["photos"] });
							}}
						></Button>
					</View>
				</View>
			);
		}
	}
}
