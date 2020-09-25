import { StyleSheet } from 'react-native';

const general = StyleSheet.create ({
	container: {
		flex: 1, 
        justifyContent: "center",
        flexDirection : "row"
	},

    cont_plan : {
        marginHorizontal: 10, 
        marginVertical: 10, 
        borderWidth: 2, 
        borderRadius: 5, 
        borderColor: "#87CA3E",
        paddingTop : 20
    },

    cont_regalo : {
        flex: 0.3, 
        borderRadius: 5, 
        alignItems: "center", 
        justifyContent: "center"
    },

    bienvenida : {
        justifyContent: "center", 
        padding: 10, 
        flex: 0.7 
    }
})

const info = StyleSheet.create ({
	
    cont_paquetes : {
        backgroundColor: "#e8e8e8", 
        flexDirection: "row-reverse", 
        padding: 10 
    },

    info_icon : {
        width: 25, 
        height: 25
    },

    info_text : {
        marginStart: 15, 
        fontSize: 15
    }

})



export { general, info }; 

