import { View, Text, StyleSheet, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useNavigation } from "@react-navigation/native";



const goals = [
  {
    id: "1",
    title: "New MacBook Pro",
    saved: 1650,
    target: 2499,
  },
  {
    id: "2",
    title: "Summer Vacation",
    saved: 890,
    target: 3500,
  },
  {
    id: "3",
    title: "Emergency Fund",
    saved: 4200,
    target: 10000,
  },
];

export function HomeScreen() {
  const navigation = useNavigation();
  
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SavingsSummaryCard />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Goals</Text>

          <Pressable style={styles.newGoalButton}>
            <Text style={styles.newGoalButtonText}>+ New Goal</Text>
          </Pressable>
        </View>

        <View style={styles.goalList}>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              title={goal.title}
              saved={goal.saved}
              target={goal.target}
              onPress={() =>
                navigation.navigate("GoalDetailsPage", {
                  goalId: goal.id,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function SavingsSummaryCard() {
  return (
    <View style={styles.summaryCard}>
      <View>
        <Text style={styles.summaryLabel}>Total Savings</Text>
        <Text style={styles.summaryAmount}>$a number</Text>

        <View style={styles.summaryFooter}>
          <Text style={styles.summaryFooterText}>Target: $15.999</Text>
          <Text style={styles.summaryFooterText}>{goals.length} active goals</Text>
        </View>
      </View>
    </View>
  );
}
/*
function totalSavings () {
  let totalSavings = 0;

  goals.map(goal =>{
    console.log(goal.saved);
    totalSavings += goal.saved;
  } )

  return totalSavings;
}*/


function GoalCard({ title, saved, target, onPress }) {
  const progress = saved / target;
  const progressPercent = Math.round(progress * 100);
  const remaining = target - saved;

  return (
    <Pressable onPress={onPress} style={styles.goalCard}>
      <Text style={styles.goalTitle}>{title}</Text>

      <Text style={styles.goalAmount}>
        {saved} of {target}
      </Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(progressPercent, 100)}%` },
          ]}
        />
      </View>

      <View style={styles.goalFooter}>
        <Text style={styles.goalFooterText}>{progressPercent}% complete</Text>
        <Text style={styles.remainingText}>{remaining} to go</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },

  summaryCard: {
    minHeight: 148,
    borderRadius: 22,
    backgroundColor: "#1f5cff",
    padding: 24,
    justifyContent: "center",
    marginBottom: 26,
  },

  summaryLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },

  summaryAmount: {
    marginTop: 4,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "500",
    color: "#fff",
  },

  summaryFooter: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryFooterText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.82)",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
  },

  newGoalButton: {
    height: 42,
    borderRadius: 8,
    backgroundColor: "#050514",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  newGoalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },

  goalList: {
    gap: 16,
  },

  goalCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 24,
  },

  goalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },

  goalAmount: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 18,
  },

  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "#d1d1d6",
    overflow: "hidden",
    marginBottom: 18,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#050514",
  },

  goalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  goalFooterText: {
    fontSize: 15,
    color: "#475569",
  },

  remainingText: {
    fontSize: 15,
    color: "#005cff",
  },
});
