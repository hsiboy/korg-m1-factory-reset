# Korg M1 Factory Reset Tool

A web-based tool for restoring factory presets to the Korg M1 synthesizer using WebMIDI. This tool helps M1 owners restore their synth's original sounds and sequences after a battery replacement or memory loss.

## About the Korg M1

The Korg M1 was one of the most popular music workstations ever made, produced from 1988 to 1995. It was available in several variants:
- Korg M1 (original keyboard workstation)
- Korg M1R (rack-mount version)
- Korg M1EX (expanded version with more memory)
- Korg M1REX (rack-mount expanded version)

The M1 uses battery-backed RAM to store its sounds and sequences. When this battery fails, the unit loses all its preset data. This tool helps restore the factory data after battery replacement.

## Features

- Support for all M1 variants (M1/M1R and M1EX/M1REX)
- Restores both factory sounds and demo sequences
- Works with any MIDI interface supported by WebMIDI
- Multiple MIDI device selection for users with multiple interfaces
- Drag-and-drop support for custom SysEx files
- Real-time MIDI device connection monitoring
- Clear visual feedback during the update process

## Requirements

- A web browser that supports WebMIDI (Chrome or Edge recommended)
- A MIDI interface connected to your computer
- Your Korg M1 connected via MIDI
- A working battery installed in your M1

## Usage

1. Visit [https://hsiboy.github.io/korg-m1-factory-reset](https://hsiboy.github.io/korg-m1-factory-reset)
2. Select your MIDI output device
3. Choose your M1 model (M1/M1R or M1EX/M1REX)
4. Select whether to restore factory sounds or demo sequences
5. Click "Send to M1" and wait for the transfer to complete

## Development

This project is built using:
- React
- WebMIDI API
- Tailwind CSS

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/hsiboy/korg-m1-factory-reset.git
cd korg-m1-factory-reset

# Install dependencies
npm install

# Start the development server
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Acknowledgments

- Thanks to Korg for creating the M1 and providing the factory SysEx files
- Built using the WebMIDI API and React
- Designed to help preserve these classic synthesizers

## Safety Note

Always ensure your M1 has a working battery installed before attempting to restore factory presets. The battery voltage should be checked and the battery replaced if necessary before using this tool.