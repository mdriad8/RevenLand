import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const services = [
  {
    id: '1',
    title: 'Consultancy',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnS2QR0aRbIo_A4UoevcfkbOGoLsDgVtFyLQ&s',
    description: 'Professional consultancy services.',
  },
  {
    id: '2',
    title: 'Resume Review',
    image: 'https://www.resource-connection.com/wp-content/uploads/2017/11/Review-Resume.jpg',
    description: 'Get your resume reviewed by experts.',
  },
  {
    id: '3',
    title: 'Career Guidance',
    image: 'https://www.univariety.com/blog/wp-content/uploads/2018/04/career-counselling-and-guidance.jpg',
    description: 'Plan your career with our experts.',
  },
  {
    id: '4',
    title: 'Job Assistance',
    image: 'https://www.success-stream.co.uk/wp-content/uploads/2019/12/job-interview-success-scaled.jpg',
    description: 'Get help with job applications.',
  },
];

const Index = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.logo}
          />
          <Text style={styles.title}>Revenland</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search..." />
        <TouchableOpacity style={styles.filterButton}>
          <AntDesign name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Services Section */}
      <View style={styles.servicesContainer}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <FlatList
          horizontal
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image source={{ uri: item.image }} style={styles.serviceImage} />
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.servicesContainer}>
      <Link href="/contact" style={styles.link}>
        <Text style={styles.sectionTitle}>Our Affiliation</Text>
      </Link>
    </View>


    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef4ef',
  },
  scrollContent: {
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 66,
    backgroundColor: '#fff',
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  filterButton: {
    backgroundColor: '#E6C79C',
    padding: 8,
    borderRadius: 8,
  },
  servicesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: Dimensions.get('window').width * 0.6,
    marginRight: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, // Adjusted height offset
    shadowOpacity: 0.1, // Softer shadow
    shadowRadius: 4, // Tight radius
    elevation: 3, // Android shadow
    borderWidth: 1, // Ensure border prevents visual clipping
    borderColor: 'rgba(0, 0, 0, 0.05)', // Light border color
    overflow: 'visible', // Ensure shadow doesn't clip
    marginBottom: 8, // Add margin to separate cards visually
}, 
  serviceImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#555',
  },
  link: {
    textDecorationLine: 'none',
  },
});

export default Index;
