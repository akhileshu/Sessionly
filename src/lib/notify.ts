// function notify(type: "breakCompleted" | "taskCompleted") {
//   // Check notification permission
//   if (Notification.permission !== "granted") {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         console.log("Notification permission granted");
//       } else {
//         console.warn("Notification permission denied");
//       }
//     });
//     return;
//   }

//   let title = "";
//   let body = "";
//   let soundSrc = "";

//   switch (type) {
//     case "breakCompleted":
//       title = "Break Over!";
//       body = "Time to get back to work 💪";
//       soundSrc = "/Sessionly/sounds/break-end.mp3";
//       break;

//     case "taskCompleted":
//       title = "Break Over!";
//       body = "Great job! Time to take a short break 😌";
//       soundSrc = "/Sessionly/sounds/task-completed.mp3";
//       break;

//     default:
//       console.warn("Unknown notification type:", type);
//       return;
//   }

//   // Create and configure audio
//   const audio = new Audio(soundSrc);
//   audio.volume = 0.8;

//   let intervalId: number;
//   let playAttempts = 0;
//   const maxPlayAttempts = 3;

//   // Function to play audio and schedule repeat
//   const playLoop = () => {
//     audio.play().catch((error) => {
//       console.error("Failed to play audio:", error);
//       playAttempts++;

//       if (playAttempts < maxPlayAttempts) {
//         console.log(`Retrying audio playback (attempt ${playAttempts + 1})`);
//         setTimeout(playLoop, 1000);
//       } else {
//         console.error("Max audio playback attempts reached");
//       }
//     });
//   };

//   // Function to start the loop after first play
//   const startLoop = () => {
//     intervalId = window.setInterval(() => {
//       audio.currentTime = 0;
//       audio.play().catch((error) => {
//         console.warn("Audio playback in loop failed:", error);
//       });
//     }, audio.duration * 1000 + 2000);
//   };

//   // Set up audio event listeners
//   audio.addEventListener("loadeddata", () => {
//     console.log("Audio loaded, duration:", audio.duration);
//   });

//   audio.addEventListener("canplaythrough", () => {
//     console.log("Audio can play through, starting playback");
//     playLoop();
//   });

//   audio.addEventListener("play", () => {
//     console.log("Audio started playing");
//     // Start the loop after the first successful play
//     if (!intervalId) {
//       startLoop();
//     }
//   });

//   audio.addEventListener("error", (e) => {
//     console.error("Audio loading error:", e);
//     console.error("Audio error details:", audio.error);
//   });

//   // Create notification
//   let notification: Notification;
//   try {
//     notification = new Notification(title, { body });
//     console.log("Notification created successfully");
//   } catch (error) {
//     console.error("Failed to create notification:", error);
//     // Even if notification fails, try to play sound
//     playLoop();
//     return;
//   }

//   const stopAudio = () => {
//     console.log("Stopping audio");
//     if (intervalId) {
//       clearInterval(intervalId);
//     }
//     audio.pause();
//     audio.currentTime = 0;
//   };

//   notification.onclick = () => {
//     console.log("Notification clicked");
//     stopAudio();
//     notification.close();
//   };

//   notification.onclose = () => {
//     console.log("Notification closed");
//     stopAudio();
//   };

//   // Auto-close notification after 10 seconds
//   setTimeout(() => {
//     if (notification) {
//       notification.close();
//     }
//   }, 10000);
// }

// function notify(type: "breakCompleted" | "taskCompleted") {
//   // Check notification permission
//   if (Notification.permission !== "granted") {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         console.log("Notification permission granted");
//       } else {
//         console.warn("Notification permission denied");
//       }
//     });
//     return;
//   }

//   let title = "";
//   let body = "";
//   let soundSrc = "";

//   switch (type) {
//     case "breakCompleted":
//       title = "Break Over!";
//       body = "Time to get back to work 💪";
//       soundSrc = "/Sessionly/sounds/break-end.mp3";
//       break;

//     case "taskCompleted":
//       title = "Task Completed 🎯";
//       body = "Great job! Time to take a short break 😌";
//       soundSrc = "/Sessionly/sounds/task-completed.mp3";
//       break;

//     default:
//       console.warn("Unknown notification type:", type);
//       return;
//   }

//   // Create and configure audio
//   const audio = new Audio(soundSrc);
//   audio.volume = 0.8;
//   audio.loop = true; // Enable built-in looping

//   let intervalId: number;
//   let playAttempts = 0;
//   const maxPlayAttempts = 3;
//   let audioStopped = false;

//   // Function to play audio
//   const playAudio = () => {
//     if (audioStopped) {
//       console.log("Audio already stopped, skipping playback");
//       return;
//     }

//     audio.play().catch((error) => {
//       console.error("Failed to play audio:", error);
//       playAttempts++;

//       if (playAttempts < maxPlayAttempts && !audioStopped) {
//         console.log(`Retrying audio playback (attempt ${playAttempts + 1})`);
//         setTimeout(playAudio, 1000);
//       } else {
//         console.error("Max audio playback attempts reached");
//       }
//     });
//   };

//   // Set up audio event listeners
//   audio.addEventListener("loadeddata", () => {
//     console.log("Audio loaded, duration:", audio.duration);
//   });

//   audio.addEventListener("canplaythrough", () => {
//     console.log("Audio can play through, starting playback");
//     playAudio();
//   });

//   audio.addEventListener("play", () => {
//     console.log("Audio started playing");
//   });

//   audio.addEventListener("error", (e) => {
//     console.error("Audio loading error:", e);
//     console.error("Audio error details:", audio.error);
//   });

//   // Create notification
//   let notification: Notification;
//   try {
//     notification = new Notification(title, { body });
//     console.log("Notification created successfully");
//   } catch (error) {
//     console.error("Failed to create notification:", error);
//     // Even if notification fails, try to play sound
//     playAudio();

//     // Auto-stop after 2 minutes if notification failed
//     setTimeout(() => {
//       if (!audioStopped) {
//         console.log("2 minutes elapsed, stopping audio");
//         stopAudio();
//       }
//     }, 2 * 60 * 1000);

//     return;
//   }

//   let stopAudio = () => {
//     if (audioStopped) return;

//     console.log("Stopping audio");
//     audioStopped = true;

//     // @ts-expect-error : intervalId used before initialization
//     if (intervalId) {
//       clearInterval(intervalId);
//     }
//     audio.pause();
//     audio.currentTime = 0;
//   };

//   // Stop audio when notification is clicked
//   notification.onclick = () => {
//     console.log("Notification clicked");
//     stopAudio();
//     notification.close();

//     // Also focus the app window if possible
//     if (window.focus) {
//       window.focus();
//     }
//   };

//   // Stop audio when notification is closed
//   notification.onclose = () => {
//     console.log("Notification closed");
//     stopAudio();
//   };

//   // Stop audio after 2 minutes automatically
//   const autoStopTimeout = setTimeout(() => {
//     if (!audioStopped) {
//       console.log("2 minutes elapsed, stopping audio automatically");
//       stopAudio();
//       notification.close();
//     }
//   }, 2 * 60 * 1000);

//   // Also stop audio when user interacts with the app (clicks anywhere)
//   const stopOnInteraction = () => {
//     if (!audioStopped) {
//       console.log("App interaction detected, stopping audio");
//       stopAudio();
//       notification.close();
//       clearTimeout(autoStopTimeout);
//       document.removeEventListener("click", stopOnInteraction);
//     }
//   };

//   // Listen for any click in the app
//   document.addEventListener("click", stopOnInteraction);

//   // Clean up event listener when audio stops
//   const originalStopAudio = stopAudio;
//   stopAudio = () => {
//     originalStopAudio();
//     document.removeEventListener("click", stopOnInteraction);
//     clearTimeout(autoStopTimeout);
//   };
// }

import { useUserPreferencesStore } from "@/context/useUserPreferencesStore";

export function notify(type: "breakCompleted" | "taskCompleted") {
  const { audioOnNotification } = useUserPreferencesStore.getState(); // read without re-render

  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      } else {
        console.warn("Notification permission denied");
      }
    });
    return;
  }

  let title = "";
  let body = "";
  let soundSrc = "";

  switch (type) {
    case "breakCompleted":
      title = "Break Over!";
      body = "Time to get back to work 💪";
      soundSrc = "/Sessionly/sounds/break-end.mp3";
      break;
    case "taskCompleted":
      title = "Task Completed 🎯";
      body = "Great job! Time to take a short break 😌";
      soundSrc = "/Sessionly/sounds/task-completed.mp3";
      break;
    default:
      console.warn("Unknown notification type:", type);
      return;
  }

  let audio: HTMLAudioElement | null = null;
  let stopAudio: () => void;
  let audioStopped = false;

  if (audioOnNotification) {
    audio = new Audio(soundSrc);
    audio.volume = 0.8;
    audio.loop = true;

    const playAudio = async () => {
      try {
        await audio!.play();
        console.log("Audio started");
      } catch (err) {
        console.error("Audio play failed:", err);
      }
    };

    playAudio();

    stopAudio = () => {
      if (audioStopped) return;
      audioStopped = true;
      audio?.pause();
      audio!.currentTime = 0;
    };
  } else {
    // user disabled sound
    stopAudio = () => {};
  }

  let notification: Notification;
  try {
    notification = new Notification(title, { body });
  } catch (error) {
    console.error("Notification failed:", error);
    if (audioOnNotification) {
      // auto-stop audio after 2 minutes
      setTimeout(stopAudio, 2 * 60 * 1000);
    }
    return;
  }

  // Stop sound on user interaction
  const stopInteraction = () => {
    stopAudio();
    notification.close();
    document.removeEventListener("click", stopInteraction);
  };

  notification.onclick = stopInteraction;
  notification.onclose = stopInteraction;

  // Auto-stop sound after 2 min
  setTimeout(() => {
    if (!audioStopped) {
      stopAudio();
      notification.close();
    }
  }, 2 * 60 * 1000);

  document.addEventListener("click", stopInteraction);
}
