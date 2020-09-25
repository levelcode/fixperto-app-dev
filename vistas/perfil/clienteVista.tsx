import React, { Component } from 'react';
import { View, ScrollView, AsyncStorage, Image, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import DocumentVista from "../../componentes/documentVista";
import { NavigationEvents } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import AlertModal from "../../componentes/alertView";
import { general, info } from "../../style/profile";
import { url } from "../../componentes/config";
const misDatos = [
	{
		name: 'Información personal',
		route: 'InformacionCliente'
	}, {
		name: 'Configuración',
		route: 'Configuracion'
	},
	{
		name: 'Cambiar contraseña',
		route: 'CambiarContrasena'
	}
]
const sobreFixperto = [
	{
		name: 'Quiénes somos',
		route: 'QuienesSomos'
	}, {
		name: 'Atención al cliente',
		route: 'AtencionCliente'
	}, {
		name: 'Términos y condiciones',
		route: 'TerminosCondiciones'
	}, {
		name: 'Políticas de privacidad',
		route: 'PoliticasPrivacidad'
	},
]

export default class PerfilClienteVista extends Component {
	constructor(props) {
		super(props); this.state = { textoAlert: "", showAlert: false, photo: url + "uploads/registros/cliente/", cliente: {} };

	}
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			this.setState({
				cliente: user,
				photo: url + "uploads/registros/cliente/" + user["avatar"]
			});
		})
	}
	cerrarSesion() {
		AsyncStorage.getItem("@USER").then((user) => {
			FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/config.json')
				.then((contenido) => {
					contenido = JSON.parse(contenido);
					var notifications = (contenido["notifications"]) ? contenido["notifications"] : [];
					FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: false, vista: "Ingreso", user, notifications }))
					this.props["navigation"].popToTop();
				})
		})
	}
	savePhoto = (photo) => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			const createFormData = () => {
				const convertirImagen = (result) => {
					var name = Math.random().toString(36).substring(7, 15) + Math.random().toString(36).substring(7, 15);
					name = name + "_" + Date.now().toString();
					let localUri = result.uri;
					let filename = localUri.split('/').pop();
					let match = /\.(\w+)$/.exec(filename);
					let type = match ? `image/${match[1]}` : `image`;
					return { uri: localUri, name: user["typeId"] + name + match[0], type }
				}
				const data = new FormData();
				data.append("id", user["typeId"]);
				data.append("docs", convertirImagen(photo));
				return data;
			};
			return fetch(url + 'cliente/modAvatar', {
				method: "POST",
				headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth },
				body: createFormData()
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) { this.setState({ photo: photo.uri }) }
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	openCamera() { this.props["navigation"].navigate('Camera', { multiple: false, ruta: "PerfilCliente" }); }
	showVista = (state) => {
		if (state["params"] && state["params"]["photos"].length > 0) { this.savePhoto(state["params"]["photos"][0]); }
		AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.setState({ cliente: user }); })
	}
	render() {
		const { cliente } = this.state;
		return (

			<ScrollView style={[general.container]}>

				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />

				<NavigationEvents onDidFocus={payload => { this.showVista(payload["state"]) }} />

				<View style={[general.container_img]}>

					<View style={[info.container_img_profile, { flex: 0.40 }]}>

						<Image
							style={[info.cont_img_profile_img]}
							source={{ uri: this.state["photo"] }}>
						</Image>

						<View style={[general.container2, { position: "absolute", marginTop: 110, right: 13 }]}>
							<Button type="outline" buttonStyle={[info.img_profile_button]}
								titleStyle={info.title_buton}
								onPress={() => this.openCamera()}
								icon={<Ionicons name="ios-camera" size={20} style={[info.icon_button]} />}
							/>
							<DocumentVista selectDocuments={(photo) => { this.savePhoto(photo); }} />
						</View>

					</View>

					<View style={[general.container3, { flex: 0.60 }]}>
						<Text style={info.text_welcome}>¡Hola!</Text>
						<Text style={info.text_fixperto}>{cliente["name"]}</Text>
					</View>

				</View>

				<View style={[info.seccion_perfil]}>
					<Image source={require("../../assets/iconos/tus_datos.png")} style={info.seccion_perfil_img} />
					<Text style={[info.seccion_perfil_text]}>Tus datos</Text>
				</View>

				{
					misDatos.map((element, i) => (
						<ListItem
							key={i} bottomDivider

							containerStyle={[general.container4]}
							title={<Text>{element.name}</Text>}
							chevron={<Ionicons name="ios-arrow-forward" style={[info.icon_sub_seccion]} />}
							onPress={() => this.props["navigation"].navigate(element.route)}
						/>
					))
				}

				<View style={[info.seccion_perfil]}>
					<Image source={require("../../assets/iconos/acerca_de.png")} style={info.seccion_perfil_img} />
					<Text style={[info.seccion_perfil_text]}>Sobre fixperto</Text>
				</View>

				{
					sobreFixperto.map((element, i) => (
						<ListItem
							key={i} bottomDivider
							containerStyle={[general.container4]}
							title={<Text>{element.name}</Text>}
							chevron={<Ionicons name="ios-arrow-forward" style={[info.icon_sub_seccion]} />}
							onPress={() => this.props["navigation"].navigate(element.route)}
						/>
					))
				}
				<Button containerStyle={info.container_button} type="outline"
					buttonStyle={[info.button_close_sesion]}
					titleStyle={[info.title_button_close]} title="CERRAR SESIÓN"
					onPress={() => { this.cerrarSesion() }} />
			</ScrollView>
		)
	}
}