import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Video } from 'expo-av';
import NewsLetter from '@/components/NewsLetter';

const socialProfiles = [
  {
    id: '1',
    platform: 'LinkedIn',
    image: 'https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png',
    url: 'https://www.linkedin.com/in/your-page',
  },
  {
    id: '2',
    platform: 'Twitter',
    image: 'https://download.logo.wine/logo/Twitter/Twitter-Logo.wine.png',
    url: 'https://twitter.com/your-page',
  },
  {
    id: '3',
    platform: 'Facebook',
    image: 'https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png',
    url: 'https://www.facebook.com/your-page',
  },
];

const SCREEN_HEIGHT = Dimensions.get('window').height;

const CompanyProfile = () => {
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [newsletterVisible, setNewsletterVisible] = useState(false);
  const [modalPosition] = useState(new Animated.Value(SCREEN_HEIGHT));
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const toggleNewsletter = () => setNewsletterVisible(!newsletterVisible);

  const openAboutModal = () => {
    setAboutModalVisible(true);
    Animated.timing(modalPosition, {
      toValue: SCREEN_HEIGHT * 0.3, // Opens from the bottom to 70% of the screen
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeAboutModal = () => {
    Animated.timing(modalPosition, {
      toValue: SCREEN_HEIGHT, // Moves modal back off the screen
      duration: 300,
      useNativeDriver: false,
    }).start(() => setAboutModalVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10; // Detect vertical drag
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalPosition.setValue(SCREEN_HEIGHT * 0.3 + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          closeAboutModal();
        } else {
          Animated.spring(modalPosition, {
            toValue: SCREEN_HEIGHT * 0.3,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const interval = setInterval(shake, 5000);

    return () => clearInterval(interval);
  }, [shakeAnimation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Company Profile</Text>
        <Animated.View
          style={[styles.subscribeButton, { transform: [{ translateX: shakeAnimation }] }]}
        >
          <TouchableOpacity onPress={toggleNewsletter} style={styles.subscribeButtonInner}>
            <AntDesign name="mail" size={20} color="#fff" style={styles.subscribeIcon} />
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* About Company Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Company</Text>
          <Text style={styles.cardText} numberOfLines={4}>
            We are a leading consultancy firm providing top-notch services to our
            clients worldwide. Our mission is to deliver excellence and build long-lasting
            relationships with our clients.
          </Text>
          <TouchableOpacity onPress={openAboutModal} style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>

        {/* About Company Modal */}
        <Modal transparent visible={aboutModalVisible} animationType="none">
          <TouchableWithoutFeedback onPress={closeAboutModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[styles.modalContainer, { top: modalPosition }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Company</Text>
              <AntDesign
                name="arrowsalt"
                size={24}
                color="black"
                onPress={closeAboutModal}
              />
            </View>
            <ScrollView>
              <Text style={styles.modalText}>
                We are a leading consultancy firm providing top-notch services to our
                clients worldwide. Our mission is to deliver excellence and build
                long-lasting relationships with our clients. We believe in innovation
                and strive to exceed expectations.
              </Text>
            </ScrollView>
          </Animated.View>
        </Modal>

        {/* Social Profiles Section */}
        <View style={styles.socialProfilesContainer}>
          <Text style={styles.sectionTitle}>Social Profiles</Text>
          <FlatList
            horizontal
            data={socialProfiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.socialProfileCard}>
                <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                  <Image source={{ uri: item.image }} style={styles.socialProfileImage} />
                </TouchableOpacity>
                <Text style={styles.socialProfileText}>{item.platform}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Demo Consultancy Video */}
        <View style={styles.videoContainer}>
          <Text style={styles.sectionTitle}>Consultancy Video</Text>
          <Video
            source={{
              uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            }}
            style={styles.video}
            useNativeControls
            shouldPlay={false}
          />
        </View>

        {/* Newsletter Modal */}
        <NewsLetter
          visible={newsletterVisible}
          onClose={() => setNewsletterVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default CompanyProfile;

const styles = StyleSheet.create({
  content: {
    padding: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fef4ef',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#fff',
    paddingTop: 120,
    paddingBottom: 40,
    paddingLeft: 46,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subscribeButton: {
    borderRadius: 20,
  },
  subscribeButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6C79C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  subscribeIcon: {
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    margin: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  seeMoreButton: {
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    color: '#E6C79C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%', // Fix for space issue
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  socialProfilesContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  socialProfileCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  socialProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  socialProfileText: {
    fontSize: 14,
    color: '#555',
  },
  videoContainer: {
    margin: 16,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#000',
  },
});
