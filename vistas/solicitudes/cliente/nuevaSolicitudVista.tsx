import React, { Component } from 'react';
import { ScrollView, Text, View, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button, Image } from 'react-native-elements';
import DocumentVista from "../../../componentes/documentVista";
import DateTimePicker from '@react-native-community/datetimepicker';
import AlertModal from "../../../componentes/alertView";
import { general, info } from "../../../style/request";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from 'react-native-material-dropdown';
import { url } from "../../../componentes/config";
export default class NuevaSolicitudVista extends Component {
	constructor(props) {
		super(props);
		this.state = { am_pm: "am", textoAlert: "", showAlert: false, show_start_date: false, start_date: "", hour: { hor: "01", min: "00" }, buttonDisabled: false, user: this.props["navigation"].getParam("user"), description: "", region: [], photos: [], emergency: false };
	}
	hours = [
		{ value: '01' },
		{ value: '02' },
		{ value: '03' },
		{ value: '04' },
		{ value: '05' },
		{ value: '06' },
		{ value: '07' },
		{ value: '08' },
		{ value: '09' },
		{ value: '10' },
		{ value: '11' },
		{ value: '12' },
	];
	mins = [
		{ value: '00' },
		{ value: '05' },
		{ value: '10' },
		{ value: '15' },
		{ value: '20' },
		{ value: '25' },
		{ value: '30' },
		{ value: '35' },
		{ value: '40' },
		{ value: '45' },
		{ value: '50' },
		{ value: '55' }
	];
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps["navigation"].getParam("photos") && nextProps.navigation.getParam("photos").length > 0) {
			this.setState(prevState => ({
				photos: [...prevState["photos"].concat(nextProps.navigation.getParam("photos"))]
			}));
			this.props["navigation"].setParams({ photos: [] });
		}
		if (nextProps.navigation.getParam("regions") && nextProps.navigation.getParam("regions").length > 0) {
			this.setState({ region: nextProps.navigation.getParam("regions") });
			this.props["navigation"].setParams({ regions: [] });
		}
	}
	enviarSolicitud() {
		let vacios = [];
		if (!this.state["region"].length) { vacios.push("  *Región"); }
		if (this.state["description"] === "") { vacios.push("  *Descripción de la solicitud"); }
		if (this.props["navigation"].getParam("service").emergency) {
			if (this.state["start_date"] === "") {
				return this.setState({ showAlert: true, textoAlert: "Debe dar una fecha" });
			}
			if (this.state["hour"]["hor"] === "" || this.state["hour"]["min"] === "") {
				return this.setState({ showAlert: true, textoAlert: "Debe dar una hora" });
			}
		}
		if (!vacios.length) {
			this.setState({ buttonDisabled: true });
			const createFormData = (body) => {
				const data = new FormData();
				for (var x = 0; x < this.state["photos"].length; x++) {
					let localUri = this.state["photos"][x].uri;
					let filename = localUri.split('/').pop();
					let match = /\.(\w+)$/.exec(filename);
					let type = match ? `image/${match[1]}` : `image`;
					data.append("photos", { uri: localUri, name: this.state["user"]["typeId"] + "_" + x + "_" + this.state["photos"][x].name + "_" + Date.now().toString(), type });
				}
				Object.keys(body).forEach(key => { data.append(key, body[key]); });
				return data;
			}; return fetch(url + 'cliente/sendRequest', {
				method: "POST",
				headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth },
				body: createFormData({
					customer: this.state["user"]["typeId"],
					category: this.props["navigation"].getParam("category").id,
					region: this.state["region"][0]["id"],
					emergency: (this.props["navigation"].getParam("service").emergency) ? "1" : "0",
					description: this.state["description"],
					start_date: (this.props["navigation"].getParam("service").emergency) ? this.convertDateTime(this.state["start_date"]) : "",
					hour: (this.props["navigation"].getParam("service").emergency) ? this.hora() : "",
				})
			}).then(response => response.json()).then(responseJson => {
				this.setState({ buttonDisabled: false });
				if (responseJson.success) {
					this.props["navigation"].navigate('Enviando', { ruta: "Solicitudes", name: this.state["user"].name });
				}
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un error, inténtelo nuevamente" }); }
			})
				.catch((error) => {
					this.setState({ buttonDisabled: false });
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}
		else { return this.setState({ showAlert: true, textoAlert: "Los siguientes campos son obligatorios: " + vacios.toString() }); }
	}
	seleccionarZona() { this.props["navigation"].navigate('Region', { ruta: "NuevaSolicitud", single: true }); }
	openCamera() { this.props["navigation"].navigate('Camera', { multiple: true, ruta: "NuevaSolicitud" }); }
	deletePhoto(photo) {
		let photos = this.state["photos"];
		var i = photos.indexOf(photo);
		if (i !== -1) { photos.splice(i, 1); }
		this.setState({ photos: (photos.length > 0) ? photos : [] });
	}
	addImage = (image) => { this.setState(prevState => ({ photos: [...prevState["photos"].concat(image)] })); }
	keyExtractor = (item, index) => index.toString();
	formatDate = date => {
		let today = new Date(date); return today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
	}
	convertDateTime = (date) => {
		var fecha = new Date(date); return fecha.toISOString().split('T')[0] + ' ' + fecha.toTimeString().split(' ')[0];
	}
	formatHour = time => {
		let fecha = new Date(time);
		let hora = (fecha.getHours().toString().length === 1) ? "0" + fecha.getHours() : fecha.getHours();
		let minutos = (fecha.getMinutes().toString().length === 1) ? "0" + fecha.getMinutes() : fecha.getMinutes();
		return hora + ":" + minutos + ":00";
	}
	hora = () => {
		if (this.state["am_pm"] === "pm") {
			var h = parseInt(this.state["hour"]["hor"]);
			return (h + 12).toString().concat(":", this.state["hour"]["min"]);
		}
		else { return this.state["hour"]["hor"].concat(":", this.state["hour"]["min"]); }
	}
	render() {
		const { show_start_date, start_date, hour, photos, am_pm } = this.state;
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={[general.cont3]}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />

					<View style={{ flexDirection: "row", marginVertical: 5, alignItems: "center", marginLeft: 10 }}>
						<Image source={{ uri: this.props["navigation"].getParam('service').icon }} style={{ width: 30, height: 30, marginRight: 5 }} />
						<Text style={{ flex: 0.8 }}><Text style={{ fontFamily: "Raleway-Bold", marginEnd: 5 }}>{this.props["navigation"].getParam("service").grouped}</Text>
							{" / " + this.props["navigation"].getParam("category").denomination}
						</Text>
					</View>
					<View style={{ marginHorizontal: 10, display: (this.props["navigation"].getParam("service").emergency) ? "flex" : "none" }}>
						<Text style={{ fontFamily: "Raleway-Bold", marginVertical: 10, textAlign: "center" }}>Mi servicio es de emergencia</Text>
						<Text style={[info.cont_text_title_cat, general.cont4, { fontFamily: "Raleway-Bold" }]}>Fecha de prestación del servicio *</Text>
						<TouchableOpacity
							onPress={() => this.setState({ show_start_date: true })}
							style={{ flexDirection: "row", alignItems: "center", borderRadius: 5, borderWidth: 0.5, borderColor: "silver", height: 40 }}>
							<Text style={{ marginLeft: 5 }}>{(start_date !== "") ? this.formatDate(start_date) : ""}</Text>
							<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10, display: (start_date !== "") ? "flex" : "none" }}
								onPress={() => { this.setState({ start_date: "" }) }}
							/>
						</TouchableOpacity>
						{show_start_date && <View>
							{Platform.OS === "ios" && <Button title="CONTINUAR"
								buttonStyle={{ backgroundColor: "#49B0CD" }}
								titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
								onPress={() => { this.setState({ show_start_date: false }); }}
							/>}
							<DateTimePicker
								testID="dateInicioTimePicker"
								value={start_date || new Date()}
								minimumDate={new Date()}
								onChange={(event, start_date) => {
									if (Platform.OS === "android" && event["type"] === "set") {
										this.setState({ start_date, show_start_date: false });
									}
									else if (Platform.OS === "ios") {
										this.setState({ start_date });
									}
								}}
							/>
						</View>}
						<Text style={[info.cont_text_title_cat, general.cont4, { fontFamily: "Raleway-Bold", marginTop: 10 }]}>Hora *</Text>
						<View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
							<View style={{ flex: 0.20 }}>
								<Text style={{ fontFamily: "Raleway-Bold", textAlign: "justify", fontSize: 15, color: "#999797" }}>Horas</Text>
								<Dropdown
									itemTextStyle={{ fontFamily: "Raleway-Regular" }}
									data={this.hours}
									value={hour["hor"]}
									onChangeText={selectedItems => { this.setState(prevState => (prevState["hour"]["hor"] = selectedItems)); }}
								/>
							</View>
							<View style={{ flex: 0.35 }}>
								<Text style={{ fontFamily: "Raleway-Bold", marginLeft: 20, textAlign: "justify", fontSize: 15, color: "#999797" }}>Minutos</Text>
								<Dropdown
									containerStyle={{ marginLeft: 20 }}
									itemTextStyle={{ fontFamily: "Raleway-Regular" }}
									data={this.mins}
									value={hour["min"]}
									onChangeText={(selectedItems) => {
										this.setState(prevState => (prevState["hour"]["min"] = selectedItems))
									}}
								/>
							</View>
							<View style={{ flex: 0.20, justifyContent: "flex-end", marginLeft: 20 }}>
								<Dropdown
									itemTextStyle={{ fontFamily: "Raleway-Regular" }}
									data={[{ value: "am" }, { value: "pm" }]}
									value={am_pm}
									onChangeText={am_pm => { this.setState(prevState => (prevState["am_pm"] = am_pm)); }}
								/>
							</View>
						</View>
					</View>

					<View style={{ marginHorizontal: 10, flexDirection: "row", marginTop: 10 }}>
						<Text style={[info.cont_text_title_cat]}>
							<Text style={[info.cont_text_title]}>{this.state["user"]["name"]}</Text>
						, a continuación has una descripción detallada del servicio a solicitar, por ejemplo metros cuadrados, espacio del servicio (sala, cocina…), si es para tu casa, conjunto, empresa, se lo más específico posible será de gran ayuda para brindarte la asesoría y cotización más precisa *
						</Text>
					</View>

					<Input multiline
						inputStyle={{ borderWidth: 1, borderColor: "#ededed", marginTop: 15, borderRadius: 5, height: "auto", paddingLeft: 10, fontFamily: "Raleway-Regular", fontFamily: "Raleway-Regular" }}
						containerStyle={{ borderRadius: 5, marginBottom: 10 }}
						value={this.state["description"]}
						onChangeText={(text) => this.setState({ description: text })}
					/>

					<View style={{ marginTop: 10, flexDirection: "row", marginHorizontal: 10 }}>
						<Image source={require("../../../assets/iconos/ubicacion.png")} style={{ width: 30, height: 30 }} />
						<View style={[{ flex: 0.9, marginLeft: 5 }]}>
							<Text style={[info.cont_text_title,]}>Ubicación *</Text>
							<Text style={[general.cont4]}>Con esta información ubicaremos los expertos en tu zona</Text>
						</View>
					</View>

					{(this.state["region"].length > 0 ?
						<View style={{ marginHorizontal: 15 }}>
							<View style={{ marginTop: 10, backgroundColor: "#DDDDDD", borderRadius: 7, padding: 5 }}>
								<Text style={{ fontFamily: "Raleway-Bold", marginHorizontal: 10 }}>{this.state["region"][0]["name"]}</Text>
								<Text style={{ marginHorizontal: 10 }}>{this.state["region"][0]["description"]}</Text>
							</View>
							<Button type="outline" buttonStyle={{ borderColor: "#42AECB", borderWidth: 1 }}
								containerStyle={{ marginTop: 10 }}
								titleStyle={{ color: "#42AECB", fontFamily: "Raleway-Bold" }} title="CAMBIAR ZONA"
								onPress={() => this.seleccionarZona()} />
						</View> :
						<View style={{ marginHorizontal: 15, marginTop: 15 }}>
							<Button type="outline" buttonStyle={{ borderColor: "#42AECB", borderWidth: 1 }}
								titleStyle={{ color: "#42AECB", fontFamily: "Raleway-Bold" }} title="ELEGIR UBICACIÓN"
								onPress={() => this.seleccionarZona()} />
						</View>)
					}

					<View style={{ marginTop: 15, flexDirection: "row", marginHorizontal: 10 }}>
						<Image source={require("../../../assets/iconos/fotos.png")} style={{ width: 30, height: 30 }} />
						<View style={{ flex: 0.9, marginLeft: 5 }}>
							<Text style={[info.cont_text_title, general.cont4]}>Agrega fotos del servicio</Text>
							<Text style={[general.cont4, info.cont_text_title_cat]}>Esta información es de utilidad para los expertos</Text>
						</View>
					</View>

					<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", marginVertical: 15, padding: 20 }}>
						<View style={{ flex: 0.5 }}>
							<Button type="outline" buttonStyle={{ borderColor: "#42AECB", marginRight: 5, padding: 3, }}
								titleStyle={{ color: "#42AECB", fontFamily: "Raleway-Bold", fontSize: 12 }}
								title="TOMAR FOTO" onPress={() => this.openCamera()}
								icon={<Ionicons name="ios-camera" size={20} style={{ marginHorizontal: 5 }} color="#42AECB" />}
							/>
						</View>

						<View style={{ flex: 0.5 }}>
							<DocumentVista title="GALERÍA" selectDocuments={(photo) => { this.addImage(photo) }} />
						</View>



					</View>

					<View style={{ marginTop: 10, marginHorizontal: 10 }}>
						<FlatList horizontal data={photos}
							renderItem={({ item }) => <Image source={{ uri: item.uri }} style={{ marginStart: 15, width: 80, height: 80 }} >
								<Ionicons name="ios-close-circle" color="#CE4343" size={20}
									style={{ position: 'absolute', right: 8, top: -3 }}
									onPress={() => { this.deletePhoto(item) }}
								/>
							</Image>}
							keyExtractor={this.keyExtractor} />
					</View>
					<Button title="ENVIAR SOLICITUD" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7, marginBottom: 30 }}
						disabled={this.state["buttonDisabled"]}
						titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
						onPress={() => this.enviarSolicitud()}
					/>
				</ScrollView>
			</KeyboardAwareScrollView>
		)
	}
}