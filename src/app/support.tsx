import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { styles } from "../utils/styles";

export default function SpendingLimitScreen() {
    const router = useRouter();

    const handleSubmit = () => {
        router.push('/');
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>How can we help you ?</Text>
                <TextInput 
                    label="Support Title" 
                    placeholder="title" 
                    mode="outlined" 
                    style={styles.title}
                />

                <TextInput
                    multiline={true}
                    label="Support Content"
                    placeholder="Support Content" 
                    mode="outlined"
                    style={styles.supportContainer}
                />
                <Button mode="contained" style={styles.button} onPress={() => handleSubmit}>
                    Submit
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};
