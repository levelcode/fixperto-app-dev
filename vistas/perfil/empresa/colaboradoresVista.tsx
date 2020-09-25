import React, { Component } from 'react';
import MultiSelect from 'react-native-multiple-select';
import { View, Text, Image, TouchableOpacity, ScrollView, AsyncStorage, Platform, SafeAreaView } from 'react-native';
import { Button, ListItem, Icon, Input, Divider } from 'react-native-elements';
import Seleccionador from "../../../componentes/seleccionador";
import Copy from "../../../componentes/copyVista";
import DocumentVista from "../../../componentes/documentVista";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "../../../componentes/alertView";
import { url } from "../../../componentes/config";
export default class ColaboradoresEmpresaVista extends Component {
	multiSelect = null;
	constructor(props) {
		super(props); this.state = {
			textoAlert: "", showAlert: false,
			type: "numeric", user: {},
			categories: [], categoriesEmergency: [], collaborators: [], mod: false, buttonDisabled: false,
			collaborator: { id: "", name: "", email: "", identification_type: 1, categoriesSelected: [], categoriesEmergencySelected: [], number: "", phone: "", photo: { noDel: true, uri: "" } }
		}
	}
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user); this.getServicesConcatCategoriesEmpresa("", user); this.getCollaborators(user);
		})
	}
	addColaborador = () => {
		this.setState({
			mod: true,
			collaborator: { type: "numeric", id: "", name: "", email: "", identification_type: 1, categoriesSelected: [], categoriesEmergencySelected: [], number: "", phone: "", photo: { noDel: true, uri: "" } }
		})
	}
	getColaborador = (colaborador) => { let collaborator = Object.assign({}, colaborador); this.setState({ mod: true, collaborator }); }
	eliminar = (id) => {
		return fetch(url + 'fixpertoEmpresa/delCollaborator', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: this.state["user"]["typeId"], id })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.getCollaborators(this.state["user"]); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	getCollaborators = (user) => {
		return fetch(url + 'fixpertoEmpresa/getCollaborators', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: user["typeId"] })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ collaborators: responseJson.collaborators }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	getServicesConcatCategoriesEmpresa = (text, user) => {
		if (!(this.state["categories"].length > 0)) {
			return fetch(url + 'services/getServicesConcatCategoriesEmpresa', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ text, expert: user["typeId"] })
			}).then(response => response.json()).then(responseJson => { this.setState({ categories: responseJson.categories, categoriesEmergency: responseJson.categoriesEmergency, user }); })
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}
	}
	onSelectedCategories = categoriesSelected => {
		this.setState(prevState => (prevState["collaborator"]["categoriesSelected"] = categoriesSelected));
	}
	onSelectedCategoriesEmergency = categoriesEmergencySelected => {
		this.setState(prevState => (prevState["collaborator"]["categoriesEmergencySelected"] = categoriesEmergencySelected));
	}
	identification_type = [{ id: 1, denomination: 'Cédula de ciudadanía' }, { id: 2, denomination: 'Pasaporte' }, { id: 3, denomination: 'Cédula de extranjería' }];
	guardarColaborador = () => {
		let vacios = [];
		if (this.state["collaborator"]["photo"] === "") { vacios.push("  *Foto"); }
		if (this.state["collaborator"]["name"] === "") { vacios.push("  *Nombre"); }
		if (this.state["collaborator"]["email"] === "") { vacios.push("  *Correo"); }
		if (this.state["collaborator"]["phone"] === "") { vacios.push("  *Teléfono"); }
		if (this.state["collaborator"]["number"] === "") { vacios.push("  *Número de identificación"); }
		if (this.state["collaborator"]["categoriesSelected"].length === 0) { vacios.push("  *Categoría"); }
		if (vacios.length) {
			return this.setState({ showAlert: true, textoAlert: "Los siguientes campos son obligatorios: " + vacios.toString() });
		}
		else if (!this.validateEmail(this.state["collaborator"]["email"])) {
			return this.setState({ showAlert: true, textoAlert: "Correo inválido, por favor verifíquelo" });
		}
		else if (!this.validatePhone(this.state["collaborator"]["phone"])) {
			return this.setState({ showAlert: true, textoAlert: "Teléfono inválido, por favor verifíquelo" });
		}
		else if (!this.validateName(this.state["collaborator"]["name"])) {
			return this.setState({ showAlert: true, textoAlert: "Nombre y apellido, por favor verifíquelo" });
		}
		else if (this.state["collaborator"]["identification_type"] !== 2 && !this.validateNumber(this.state["collaborator"]["number"])) {
			return this.setState({ showAlert: true, textoAlert: "Número de identificación inválido, por favor verifíquelo" });
		}
		else {
			var urll = (this.state["collaborator"]["id"] !== "") ? "modCollaborator" : "addCollaborator";
			this.setState({ buttonDisabled: true });
			let categories = [];
			let cat = this.state["collaborator"]["categoriesSelected"].concat(this.state["collaborator"]["categoriesEmergencySelected"]);
			for (let index = 0; index < cat.length; index++) { categories.push(cat[index]["value"]); }
			const createFormData = () => {
				const convertirImagen = (result) => {
					var name = Math.random().toString(36).substring(7, 15) + Math.random().toString(36).substring(7, 15);
					name = name + "_" + Date.now().toString();
					let localUri = result.uri;
					let filename = localUri.split('/').pop();
					let match = /\.(\w+)$/.exec(filename);
					let type = match ? `image/${match[1]}` : `image`;
					return { uri: localUri, name: this.state["user"]["typeId"] + name + match[0], type }
				}
				const data = new FormData();
				data.append("expert", this.state["user"]["typeId"]);
				if (this.state["collaborator"]["id"] !== "")
					data.append("id", this.state["collaborator"]["id"]);
				Object.keys(this.state["collaborator"]).forEach(key => {
					switch (key) {
						case "name":
							data.append("name", this.state["collaborator"]["name"]);
							break;
						case "email":
							data.append("email", this.state["collaborator"]["email"]);
							break;
						case "identification_type":
							data.append("identification_type", this.state["collaborator"]["identification_type"]);
							break;
						case "number":
							data.append("number", this.state["collaborator"]["number"]);
							break;
						case "phone":
							data.append("phone", this.state["collaborator"]["phone"]);
							break;
						case "categoriesSelected":
							data.append("categoriesSelected", JSON.stringify(categories));
							break;
						case "photo":
							if (!this.state["collaborator"]["photo"]["noDel"])
								data.append("avatar", convertirImagen(this.state["collaborator"]["photo"]));
							break;
					}
				});
				return data;
			}; return fetch(url + 'fixpertoEmpresa/' + urll, {
				method: "POST", headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth }, body: createFormData()
			}).then(response => response.json()).then(responseJson => {
				this.setState({ buttonDisabled: false });
				if (responseJson.success) { this.setState({ mod: false }); this.getCollaborators(this.state["user"]); }
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
			})
				.catch((error) => {
					this.setState({ buttonDisabled: false });
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}
	}
	cancelar = () => { this.setState({ mod: false }) };
	validateEmail = email => { let reg = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; return reg.test(email.trim()); };
	validateName = name => { let reg = /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])?$/; return reg.test(name); };
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); };
	validateNumber = number => { let reg = /^[0-9]{6,11}$/; return reg.test(number); };
	render() {
		const { collaborator } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				{(this.state["mod"] === false) ? <View style={{ flex: 1 }}>
					<View style={{ display: (this.state["collaborators"].length) ? "none" : "flex" }}><Copy texto="Recuerda que para presentar ofertas debes tener un colaborador registrado" /></View>
					<Button title="AGREGAR COLABORADOR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
						titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
						onPress={() => this.addColaborador()}
					/>
					<Divider />
					<SafeAreaView>
						{
							this.state["collaborators"].map((item, i) => (
								<ListItem
									key={i} bottomDivider
									containerStyle={{ paddingVertical: 15 }}
									leftAvatar={<Image source={{ uri: item.photo["uri"] }} style={{ width: 80, height: 80, }} />}
									title={<Text style={{ fontFamily: "Raleway-Bold", marginHorizontal: 10 }}>{item.name}</Text>}
									subtitle={
										<View style={{ flexDirection: "row", marginVertical: 5 }}>
											<View style={{ flex: 0.8 }} >
												<Button buttonStyle={{ borderColor: "#47AAC9", borderWidth: 0.5, backgroundColor: "#F2FCFD", paddingVertical: 3, paddingHorizontal: 15 }} title="Modificar" titleStyle={{ fontFamily: "Raleway-Bold", fontSize: 12, color: "#47AAC9" }}
													containerStyle={{ marginHorizontal: 10, alignItems: "flex-start" }}
													onPress={() => this.getColaborador(item)} />
											</View>
											<TouchableOpacity style={{ flex: 0.2 }} onPress={() => this.eliminar(item.id)}>
												<Icon name="delete" size={20} color="#AE3E3B" style={{ alignItems: "flex-end" }} />
											</TouchableOpacity>
										</View>
									}
								/>
							))
						}
					</SafeAreaView>
				</View>
					:
					<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
						extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
						<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
							<View style={{ alignItems: "center" }}>
								<Text style={{ fontFamily: "Raleway-Bold", color: "#273861", textAlign: "center", fontSize: 20, marginVertical: 15 }}>Registro de tu colaborador</Text>
								<Image source={(collaborator["photo"]["uri"] !== "") ? { uri: collaborator["photo"]["uri"] } : require("../../../assets/icon.png")} style={{ width: 120, height: 120 }} />
								<View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 5 }}>
									<DocumentVista selectDocuments={(photo) => {
										photo["noDel"] = false;
										this.setState(prevState => (prevState["collaborator"]["photo"] = photo))
									}} />
								</View>
								<Copy texto="Busca una foto que muestre muy bien tu cara, esto es muy importante para generar confianza en tus clientes." />
							</View>

							<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Nombres y Apellidos *</Text>

							<Input
								inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
								inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
								value={collaborator["name"]}
								onChangeText={(name) => this.setState(prevState => (prevState["collaborator"]["name"] = name))}
							/>

							<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Correo *</Text>
							<Input
								inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
								inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
								value={collaborator["email"]}
								onChangeText={(email) => this.setState(prevState => (prevState["collaborator"]["email"] = email))}
							/>
							<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Tipo de Identificación *</Text>
							<MultiSelect
								hideTags hideDropdown hideSubmitButton single
								items={this.identification_type}
								uniqueKey="id"
								displayKey="denomination"
								onSelectedItemsChange={(selectedItems) => {
									this.setState(prevState => (prevState["collaborator"]["identification_type"] = selectedItems[0]))
								}}
								selectedItems={[collaborator["identification_type"]]}
								tagTextColor="#CCC"
								selectedItemTextColor="#CCC"
								itemTextColor="#000"
								styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
								searchInputPlaceholderText="Buscar..."
								selectText="Seleccione"
							/>
							<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Número de Identificación *</Text>
							<Input
								keyboardType={'numeric'}
								inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
								inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
								value={collaborator["number"]}
								onChangeText={(number) => this.setState(prevState => (prevState["collaborator"]["number"] = number))}
							/>
							<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
								<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
									<Icon name="user-o" type="font-awesome" size={20} />
									<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Elige las categorías a las que perteneces *</Text>
								</View>
								<Seleccionador
									texto="Seleccionar categorías..."
									confirm={this.onSelectedCategories}
									items={this.state["categories"]}
									selectedItems={this.state["collaborator"]["categoriesSelected"]}
									cp={(category_proposal) => { }}
									category_proposal=""
									add_cp={(category) => { }}
								/>
								<View style={{ marginTop: 15 }}>
									<Seleccionador
										texto="Seleccionar categorías de emergencia..."
										confirm={this.onSelectedCategoriesEmergency}
										items={this.state["categoriesEmergency"]}
										selectedItems={this.state["collaborator"]["categoriesEmergencySelected"]}
										category_proposal=""
										cp={(category_proposal) => { }}
										add_cp={(category) => { }}
									/>
								</View>
							</View>
							<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Teléfono *</Text>
							<Input
								keyboardType={'numeric'}
								inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
								inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
								value={collaborator["phone"]}
								onChangeText={(phone) => this.setState(prevState => (prevState["collaborator"]["phone"] = phone))}
							/>

							<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
								<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
							</View>

							<View style={{ marginHorizontal: 25, marginVertical: 20, flexDirection: "row" }}>
								<Button title="GUARDAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 0, borderColor: "#43AECC", borderWidth: 1, }}
									disabled={this.state["buttonDisabled"]}
									titleStyle={{ fontFamily: "Raleway-Bold" }}
									containerStyle={{ flex: 0.5, marginRight: 10 }}
									onPress={() => this.guardarColaborador()}
								/>
								<Button title="CANCELAR" buttonStyle={{ borderRadius: 0, borderColor: "#CE4343", borderWidth: 1, backgroundColor: "white", }}
									disabled={this.state["buttonDisabled"]}
									titleStyle={{ fontFamily: "Raleway-Bold", color: "#CE4343" }}
									containerStyle={{ flex: 0.5 }}
									onPress={() => this.cancelar()}
								/>

							</View>
						</ScrollView>
					</KeyboardAwareScrollView >
				}
			</View>
		)
	}
}