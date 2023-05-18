import React, { Fragment, useEffect, useState } from 'react'
import { View, Text, Image, StatusBar, ActivityIndicator, FlatList } from 'react-native'
import { API } from './Service';

const ApiGetData = () => {
    const [datas, setDatas] = useState([]);
    const [loader, setLoader] = useState(true);

    const GetData = async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        await API.get('/countries', { signal: signal })
            .then((response) => {
                const newData = response?.map((value) => ({
                    "id": value?.id,
                    "name": value?.name,
                    "iso2": value?.iso2,
                    "flag": `https://flagcdn.com/w20/${value?.iso2?.toLowerCase()}.png`
                }))
                setDatas(newData)
            })
            .catch((error) => {
                if (error?.response) {
                    console.log('response error', error?.response?.data)
                } else if (error.request) {
                    console.log('request error', error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log('error', error.config);
            })
            .finally(() => {
                setLoader(false)
            })
        controller.abort()
    }

    useEffect(() => {
        GetData();
    }, [])


    if (loader) {
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar barStyle={'dark-content'} animated={true} backgroundColor={'#FFFFFF'} />
                <ActivityIndicator size={'large'} color={'blue'} />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <StatusBar barStyle={'dark-content'} animated={true} backgroundColor={'#FFFFFF'} />
            <FlatList
                data={datas}
                ListEmptyComponent={() => {
                    return (
                        <Fragment>
                            <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#000000', fontSize: 18, fontWeight: 700 }}>NO DATA FOUND</Text>
                            </View>
                        </Fragment>
                    )
                }}
                ItemSeparatorComponent={() => {
                    return (
                        <View style={{ height: 5 }} />
                    )
                }}
                renderItem={({ item, index, separators }) => {

                    return (
                        <Fragment>
                            <View
                                onPress={() => { }}
                                style={{ backgroundColor: '#FFFFFF', elevation: 6, marginHorizontal: 15, padding: 10, borderRadius: 10, marginTop: 15 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 50, height: 50, borderRadius: 100 }}>
                                        <Image source={{ uri: item?.flag }} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                                    </View>
                                    <View style={{ paddingLeft: 15 }}>
                                        <Text style={{ color: '#000000', fontSize: 18, fontWeight: 700 }}>{item?.id}</Text>
                                        <Text style={{ color: '#000000', fontSize: 18, fontWeight: 700 }}>{item?.name}</Text>
                                        <Text style={{ color: '#000000', fontSize: 16, fontWeight: 500 }}>{item?.iso2}</Text>
                                    </View>
                                </View>
                            </View>
                        </Fragment>
                    )
                }}
                keyExtractor={(item) => item?.id}
            />
        </View>
    )
}

export default ApiGetData