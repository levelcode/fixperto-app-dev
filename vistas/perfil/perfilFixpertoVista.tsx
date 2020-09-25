import React, { Component } from 'react';
import { View, ScrollView, AsyncStorage, Image, TouchableOpacity, Text } from 'react-native';
import { ListItem, Button, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import Copy from "../../componentes/copyVista";
import { NavigationEvents } from 'react-navigation';
import DocumentVista from "../../componentes/documentVista";
import * as FileSystem from 'expo-file-system';
import AlertModal from "../../componentes/alertView";
import { general, info, estandar } from "../../style/profile";
import { url } from "../../componentes/config";
const misDatosEmpresa = [
	{
		name: 'Perfil empresarial',
		route: 'ProfesionalEmpresa'
	}, {
		name: 'Mis Colaboradores',
		route: 'ColaboradoresEmpresa'
	},
]
const datosServicioEmpresa = [
	{
		name: 'Cobertura',
		route: 'CoberturaEmpresa'
	},
	{
		name: 'Proyectos',
		route: 'ProyectosEmpresa'
	},
	{
		name: 'Configuración',
		route: 'Configuracion'
	},
	{
		name: 'Reportes de trabajo',
		route: 'ReportesTrabajos'
	},
]
const misDatosIndependiente = [
	{
		name: 'Información personal',
		route: 'InformacionIndependiente'
	}, {
		name: 'Seguridad social',
		route: 'SeguridadSocialIndependiente'
	},
]
const datosServicioIndependiente = [
	{
		name: 'Perfil profesional',
		route: 'ProfesionalIndependiente'
	}, {
		name: 'Cobertura',
		route: 'CoberturaIndependiente'
	},
	{
		name: 'Proyectos',
		route: 'ProyectosIndependiente'
	},
	{
		name: 'Configuración',
		route: 'Configuracion'
	},
	{
		name: 'Reportes de trabajo',
		route: 'ReportesTrabajos'
	},
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
export default class PerfilExpertoVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, photo: url + "uploads/registros/", experto: { planUri: "regalo" } }; }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			this.setState({
				experto: user,
				photo: (user["type"] === "independiente") ? url + "uploads/registros/profesional/" + user["avatar"]
					: url + "uploads/registros/empresa/" + user["avatar"]
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
	openCamera() { this.props["navigation"].navigate('Camera', { multiple: false, ruta: "PerfilFixperto" }); }
	showVista = (state) => {
		if (state["params"] && state["params"]["photos"].length > 0) { this.savePhoto(state["params"]["photos"][0]); }
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			if (user["cant_fitcoints"] > this.state["experto"]["cant_fitcoints"]) {
				if (this.props["navigation"].getParam("_emitter")) {
					this.props["navigation"].getParam("_emitter").emit("updateCantFitcoints", user["cant_fitcoints"]);
				}
			}
			this.setState({ experto: user });
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
			var urll = url;
			urll += (user["type"] === "independiente") ? "fixpertoProfesional/modAvatarProfesional" : "fixpertoEmpresa/modAvatarEmpresa"
			return fetch(urll, {
				method: "POST",
				headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth },
				body: createFormData()
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					this.setState({ photo: photo.uri })
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	componentWillUnmount() {
		if (this.props["navigation"].getParam("_emitter")) {
			this.props["navigation"].getParam("_emitter").removeAllListeners();
		}
	}
	render() {
		const { experto } = this.state;
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
						<Text style={[info.text_welcome, estandar.texto_bold]}>¡Hola!</Text>
						<Text style={[info.text_fixperto, estandar.texto]}>{experto["name"]}</Text>
					</View>
				</View>

				{
					(experto["planStatus"] === "cancelled") ?

						<TouchableOpacity onPress={() => { this.props["navigation"].navigate("Planes") }}
							style={{ backgroundColor: "#FBDCC9", paddingVertical: 15, flex: 1, flexDirection: "row", marginVertical: 15, marginHorizontal: 20, borderRadius: 7, borderColor: "#F36410", borderWidth: 2 }}>
							<View style={{ flex: 0.3, alignItems: "center" }}>
								<Image source={require("../../assets/iconos/compra_plan.png")} style={{ width: 38, height: 35 }} />
							</View>
							<View style={{ flex: 0.7, }}>
								<Text style={{ fontFamily: "Raleway-Bold", fontSize: 18, color: "#F36410", marginTop: 8 }}>COMPRA TU PLAN</Text>
							</View>
						</TouchableOpacity> :

						<TouchableOpacity onPress={() => { this.props["navigation"].navigate("TuPlan", { planId: experto["planId"], planUri: experto["planUri"], planEnd: experto["planEnd"], planPrice: experto["planPrice"] }) }}
							style={[info.cont_plan_actual]}>
							<View style={info.cont_plan_img}>
								<Image source={(experto["planUri"] === "regalo") ?
									require("../../assets/iconos/regalo.png") : (experto["planUri"] === "oro") ?
										require("../../assets/iconos/oro.png") :
										require("../../assets/iconos/bronce.png")} style={{ width: 50, height: 50 }} />
							</View>
							<View style={info.cont_plan_text}>
								<Text style={{ fontSize: 18, fontFamily: "Raleway-Bold", color: "#273861" }}>Plan actual:</Text>
								<Text style={{ fontSize: 18, marginVertical: 5, color: "#273861" }}>Plan {(experto["planUri"] === "regalo") ? "bienvenida" : experto["planUri"]}</Text>
							</View>
						</TouchableOpacity>

				}
				<Divider />

				<TouchableOpacity onPress={() => { this.props["navigation"].navigate("Fixcoins") }}
					style={{ flexDirection: "row-reverse", padding: 10, alignItems: "center" }}>
					<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />
					<Text style={{ fontSize: 20, fontFamily: "Raleway-Bold", color: "#46ADCC", marginHorizontal: 10 }}>{experto["cant_fitcoints"]}</Text>
					<Text style={{ fontSize: 15, textAlign: "left", flex: 1, marginHorizontal: 10 }}>fixcoin</Text>
					<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 25, height: 25 }} />
				</TouchableOpacity>

				<Divider />

				<TouchableOpacity onPress={() => { this.props["navigation"].navigate("ReferirAmigo") }}
					style={{ flexDirection: "row-reverse", padding: 10 }}>
					<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />
					<Text style={{ fontSize: 15, textAlign: "left", flex: 1, marginHorizontal: 10 }}>Refiere a un amigo y gana</Text>
					<Image source={require("../../assets/iconos/amigo.png")} style={{ width: 25, height: 25 }} />
				</TouchableOpacity>

				<Divider />

				<TouchableOpacity onPress={() => { this.props["navigation"].navigate("CambiarContrasena") }}
					style={{ flexDirection: "row-reverse", padding: 10 }}>
					<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />
					<Text style={{ fontSize: 15, textAlign: "left", flex: 1, marginHorizontal: 10 }}>Cambiar contraseña</Text>
					<Image source={require("../../assets/iconos/password.png")} style={{ width: 25, height: 25 }} />
				</TouchableOpacity>

				<Divider />

				<View style={info.cont_subtitle}>
					<Image source={require("../../assets/iconos/tus_datos.png")} style={{ width: 25, height: 25 }} />
					<Text style={[info.cont_subtitle_text]}>Mis datos</Text>
				</View>

				<View style={{ marginHorizontal: 20 }}>
					<Copy texto="Completa todos tus datos así aumentarás la confianza y preferencia de tus clientes" />
				</View>

				{(experto["type"] === "independiente") ?
					misDatosIndependiente.map((element, i) => (
						<ListItem
							key={i} bottomDivider
							containerStyle={{ borderTopWidth: 0.5, borderTopColor: "#E0E0E0" }}
							title={<Text>{element.name}</Text>}
							chevron={<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />}
							onPress={() => this.props["navigation"].navigate(element.route)}
						/>
					))
					:
					misDatosEmpresa.map((element, i) => (
						<ListItem
							key={i} bottomDivider
							containerStyle={{ borderTopWidth: 0.5, borderTopColor: "#E0E0E0" }}
							title={<Text>{element.name}</Text>}
							chevron={<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />}
							onPress={() => this.props["navigation"].navigate(element.route)}
						/>
					))
				}

				<View style={[info.seccion_perfil]}>
					<Image source={require("../../assets/iconos/tus_datos.png")} style={info.seccion_perfil_img} />
					<Text style={[info.seccion_perfil_text]}>Datos de servicio</Text>
				</View>

				{(experto["type"] === "independiente") ?
					datosServicioIndependiente.map((element, i) => (
						<ListItem
							key={i} bottomDivider
							containerStyle={{ borderTopWidth: 0.5, borderTopColor: "#E0E0E0" }}
							title={<Text>{element.name}</Text>}
							chevron={<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />}
							onPress={() => this.props["navigation"].navigate(element.route)}
						/>
					))
					:
					datosServicioEmpresa.map((element, i) => (
						<ListItem
							key={i} bottomDivider
							containerStyle={{ borderTopWidth: 0.5, borderTopColor: "#E0E0E0" }}
							title={<Text>{element.name}</Text>}
							chevron={<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />}
							onPress={() => this.props["navigation"].navigate(element.route)}
						/>
					))
				}

				<View style={[info.seccion_perfil]}>
					<Image source={require("../../assets/iconos/acerca_de.png")} style={info.seccion_perfil_img} />
					<Text style={[info.seccion_perfil_text]}>Sobre ﬁxperto</Text>
				</View>

				{
					sobreFixperto.map((element, i) => (
						<ListItem
							key={i} bottomDivider
							containerStyle={{ borderTopWidth: 0.5, borderTopColor: "#E0E0E0" }}
							title={<Text>{element.name}</Text>}
							chevron={<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />}
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