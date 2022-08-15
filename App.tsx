import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  Button,
  Switch,
  SafeAreaView,
} from 'react-native';
import {Player, Recorder} from './src';
import Slider from '@react-native-community/slider';

const App = () => {
  let player: Player | null;
  let recorder: Recorder | null;
  let lastSeek: number;
  let _progressInterval: IntervalID;

  const [playPauseButton, setPlayPauseButton] =
    useState<string>('Preparing...');
  const [recordButton, setRecordButton] = useState<string>('Preparing...');
  const [stopButtonDisabled, setStopButtonDisabled] = useState<boolean>(true);
  const [playButtonDisabled, setPlayButtonDisabled] = useState<boolean>(true);
  const [recordButtonDisabled, setRecordButtonDisabled] =
    useState<boolean>(true);
  const [loopButtonStatus, setLoopButtonStatus] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    player = 1;
    recorder = null;
    lastSeek = 0;

    _reloadPlayer();
    _reloadRecorder();

    _progressInterval = setInterval(() => {
      if (player && _shouldUpdateProgressBar()) {
        let currentProgress = Math.max(0, player.currentTime) / player.duration;
        if (isNaN(currentProgress)) {
          currentProgress = 0;
        }
        setProgress(currentProgress);
      }
    }, 100);
  }, []);

  const _shouldUpdateProgressBar = () => {
    // Debounce progress bar update by 200 ms
    return Date.now() - lastSeek > 200;
  };

  const _updateState = err => {
    setPlayPauseButton(() => (player && player.isPlaying ? 'Pause' : 'Play'));
    setRecordButton(() =>
      recorder && recorder.isRecording ? 'Stop' : 'Record',
    );
    setStopButtonDisabled(() => !player || !player.canStop);
    setPlayButtonDisabled(
      () => !player || !player.canPlay || recorder.isRecording,
    );
    setRecordButtonDisabled(() => !recorder || (player && !player.isStopped));
  };

  const _playPause = () => {
    player.playPause((err, paused) => {
      if (err) {
        setError(err.message);
      }
      _updateState();
    });
  };

  const _stop = () => {
    player.stop(() => {
      _updateState();
    });
  };

  const _seek = percentage => {
    if (!player) {
      return;
    }

    lastSeek = Date.now();

    let position = percentage * player.duration;

    player.seek(position, () => {
      _updateState();
    });
  };

  const _reloadPlayer = () => {
    if (player) {
      player.destroy();
    }

    player = new Player(
      'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3',
      {
        autoDestroy: false,
        continuesToPlayInBackground: false,
      },
    );
    player.looping = true;

    let isAndroid = Platform.OS === 'android';
    if (isAndroid) {
      player.speed = 0.0;
    }
    player.prepare(err => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else if (player) {
        player.play(error => {
          if (error) {
            console.log('playback error', error);
          } else {
            if (isAndroid && player) {
              player.speed = 1.0;
            }
          }
        });
        player.looping = loopButtonStatus;
      }

      _updateState();
    });

    _updateState();

    player.on('ended', () => {
      _updateState();
    });
    player.on('pause', () => {
      _updateState();
    });
  };

  const _reloadRecorder = () => {
    if (recorder) {
      recorder.destroy();
    }

    recorder = new Recorder(
      'https://consumer-static-assets.stg.ableto.com/meditations/27_calm_breathe.mp3',
      {
        bitrate: 256000,
        channels: 2,
        sampleRate: 44100,
        quality: 'max',
      },
    );

    _updateState();
  };

  const _requestRecordAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message:
            'ExampleApp needs access to your microphone to test react-native-audio-toolkit.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const _toggleLooping = value => {
    setLoopButtonStatus(value);

    if (player) {
      player.looping = value;
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>Playback</Text>
      </View>
      <View>
        <Button
          title={playPauseButton}
          // disabled={state.playButtonDisabled}
          onPress={() => _playPause()}
        />
        <Button
          title={'Stop'}
          disabled={stopButtonDisabled}
          onPress={() => _stop()}
        />
      </View>
      <View style={styles.settingsContainer}>
        <Switch
          onValueChange={value => _toggleLooping(value)}
          value={loopButtonStatus}
        />
        <Text>Toggle Looping</Text>
      </View>
      <View style={styles.slider}>
        <Slider
          step={0.0001}
          disabled={playButtonDisabled}
          onValueChange={percentage => _seek(percentage)}
          value={progress}
        />
      </View>
      <View>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  slider: {
    height: 10,
    margin: 10,
    marginBottom: 50,
  },
  settingsContainer: {
    alignItems: 'center',
  },
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: 'red',
  },
});

export default App;
