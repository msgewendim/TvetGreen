import React, { useEffect } from "react";
import { initializeLearningStore } from "@/src/store/learningStore";
import { MyLearningScreen } from "@/src/screens/learning/MyLearningScreen";

export default function LearnTab() {
	// Initialize the learning store when the tab mounts
	useEffect(() => {
		initializeLearningStore();
	}, []);

	return <MyLearningScreen />;
}
