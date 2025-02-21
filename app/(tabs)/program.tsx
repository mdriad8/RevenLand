import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  RefreshControl,
  Dimensions,
  TouchableWithoutFeedback,
  Share,
} from 'react-native';
import { Client, Databases } from 'react-native-appwrite';
import { AntDesign, Entypo } from '@expo/vector-icons';

interface ProgramType {
  $id: string;
  name: string;
  date: string;
  day: string;
  imageUrl: string;
  details: string;
  liked: number; // Updated to integer to match database
}

const Program = () => {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ProgramType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Appwrite client setup
  const client = new Client();
  const database = new Databases(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('676d8544001a9daa9b07'); // Replace with your project ID

  useEffect(() => {
    fetchPrograms();
  }, [currentMonth]); // Reload programs when the month changes

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await database.listDocuments(
        '676d864e0013f5321b88', // Database ID
        '213' // Collection ID
      );
      const programsData: ProgramType[] = response.documents.map((doc) => ({
        $id: doc.$id,
        name: doc.name,
        date: doc.date, // Ensure the date is in ISO 8601 format
        day: doc.day,
        imageUrl: doc.imageUrl,
        details: doc.details,
        liked: doc.liked || 0, // Default to 0 if undefined
      }));
      setPrograms(programsData);
    } catch (error) {
      console.error('Error fetching programs:', error);
      Alert.alert('Error', 'Failed to fetch programs. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleLike = async (programId: string) => {
    const program = programs.find((p) => p.$id === programId);
    if (!program) return;

    const newLikedStatus = program.liked === 1 ? 0 : 1; // Toggle between 1 and 0

    // Optimistically update the local state for smooth UI updates
    setPrograms((prevPrograms) =>
      prevPrograms.map((p) =>
        p.$id === programId ? { ...p, liked: newLikedStatus } : p
      )
    );

    if (selectedProgram && selectedProgram.$id === programId) {
      setSelectedProgram({ ...selectedProgram, liked: newLikedStatus });
    }

    try {
      await database.updateDocument(
        '676d864e0013f5321b88', // Database ID
        '213', // Collection ID
        programId, // Document ID
        { liked: newLikedStatus } // Update the liked status
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like status.');
      // Revert local state if the update fails
      setPrograms((prevPrograms) =>
        prevPrograms.map((p) =>
          p.$id === programId ? { ...p, liked: program.liked } : p
        )
      );
    }
  };

  const shareProgram = async (program: ProgramType) => {
    try {
      await Share.share({
        message: `Check out this program: ${program.name}\n${program.details}\nDate: ${program.date} (${program.day})`,
      });
    } catch (error) {
      console.error('Error sharing program:', error);
      Alert.alert('Error', 'Failed to share program.');
    }
  };

  const openProgramDetails = (program: ProgramType) => {
    setSelectedProgram(program);
    setModalVisible(true);
  };

  const closeProgramDetails = () => {
    setSelectedProgram(null);
    setModalVisible(false);
  };

  const changeMonth = (offset: number) => {
    const newMonth = (currentMonth + offset + 12) % 12;
    setCurrentMonth(newMonth);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPrograms();
  };

  const filteredPrograms = programs.filter((program) => {
    const programDate = new Date(program.date); // ISO 8601-compatible parsing
    const programMonth = programDate.getMonth();
    return programMonth === currentMonth;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Programs</Text>
      </View>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.monthChange}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.currentMonth}>{months[currentMonth]}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.monthChange}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Program List */}
      {loading ? (
        <Text style={styles.loadingText}>Loading programs...</Text>
      ) : filteredPrograms.length > 0 ? (
        <FlatList
          data={filteredPrograms}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => openProgramDetails(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.programName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.programDate}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.programDay}>{item.day}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <Text style={styles.noProgramsText}>
          No programs available for this month.
        </Text>
      )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={closeProgramDetails}
        >
          <TouchableWithoutFeedback onPress={closeProgramDetails}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Image
                    source={{ uri: selectedProgram.imageUrl }}
                    style={styles.programImage}
                  />
                  <View style={styles.actionsContainer}>
                    <View style={styles.likeButtonContainer}>
                      <AntDesign
                        name={selectedProgram.liked === 1 ? "heart" : "hearto"}
                        size={24}
                        color={selectedProgram.liked === 1 ? "red" : "black"}
                        onPress={() => toggleLike(selectedProgram.$id)}
                      />
                      <Text style={styles.likeCount}>{selectedProgram.liked} Likes</Text>
                    </View>
                    <View>
                      <Entypo
                        name="share"
                        size={24}
                        color="black"
                        onPress={() => shareProgram(selectedProgram)}
                      />
                    </View>
                  </View>
                  <Text style={styles.modalProgramName}>{selectedProgram.name}</Text>
                  <Text style={styles.modalDetails}>{selectedProgram.details}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default Program;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef4ef',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 120,
    paddingBottom: 40,
    paddingLeft: 46,
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    elevation: 2,
  },
  currentMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 60,
  },
  monthChange: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E6C79C',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 8,
  },
  programName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  programDate: {
    fontSize: 14,
    color: '#555',
  },
  programDay: {
    fontSize: 14,
    color: '#555',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  noProgramsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#777',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: Dimensions.get('screen').height * 0.5,
  },
  programImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalProgramName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  likeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
});
