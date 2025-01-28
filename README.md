










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

- 🎹 Support for all M1 variants (M1/M1R and M1EX/M1REX)
- 💾 Restores both factory sounds and demo sequences
- 🔌 Works with any MIDI interface supported by WebMIDI (Multiple MIDI device selection for users with multiple interfaces)
- 🌐 Works directly in your browser - no installation needed
- 📱 Drag-and-drop support for custom SysEx files


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

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅      |
| Edge    | ✅      |
| Opera   | ✅      |
| Firefox | ❌      |
| Safari  | ❌      |



## Contributing

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

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The Korg M1 synthesizer was released in 1988 and was one of the most successful music workstations ever made
- Thanks to the WebMIDI API team for making browser-based MIDI applications possible
- Built using the WebMIDI API and React
- Designed to help preserve these classic synthesizers

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/hsiboy/Korg-Librarian/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide as much detail as possible, including:
   - Browser version
   - MIDI interface details
   - Steps to reproduce the issue

> [!NOTE]
> Always ensure your M1 has a working battery installed before attempting to restore factory presets. The battery voltage should be checked and the battery replaced if necessary before using this tool.

## Roadmap

Future improvements planned:

- [ ] Batch export/import of patches
- [ ] Patch naming and categorization
- [ ] Patch editing interface
- [ ] MIDI channel configuration
- [ ] Support for other Korg synthesizers

---

Created by [hsiboy](https://github.com/hsiboy) | [Report an Issue](https://github.com/hsiboy/Korg-Librarian/issues)
