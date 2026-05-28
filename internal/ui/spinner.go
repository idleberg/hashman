package ui

import (
	"fmt"

	"charm.land/bubbles/v2/spinner"
	tea "charm.land/bubbletea/v2"
	"charm.land/lipgloss/v2"

	"github.com/idleberg/go-hashman/internal/hasher"
)

type HashFunc func() []hasher.Result

type hashDoneMsg struct {
	results []hasher.Result
}

// SpinnerModel is the bubbletea model for the hashing spinner.
type SpinnerModel struct {
	spinner  spinner.Model
	filePath string
	count    int
	hashFn   HashFunc
	results  []hasher.Result
	done     bool
}

// Results returns the hash results after the spinner completes.
func (m SpinnerModel) Results() []hasher.Result {
	return m.results
}

// NewSpinnerModel creates a new spinner model for hashing a file.
func NewSpinnerModel(filePath string, count int, hashFn HashFunc) SpinnerModel {
	s := spinner.New(
		spinner.WithSpinner(spinner.Dot),
		spinner.WithStyle(lipgloss.NewStyle().Foreground(lipgloss.BrightCyan)),
	)
	return SpinnerModel{
		spinner:  s,
		filePath: filePath,
		count:    count,
		hashFn:   hashFn,
	}
}

func (m SpinnerModel) Init() tea.Cmd {
	return tea.Batch(m.spinner.Tick, m.doHash)
}

func (m SpinnerModel) doHash() tea.Msg {
	results := m.hashFn()
	return hashDoneMsg{results: results}
}

func (m SpinnerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyPressMsg:
		if msg.String() == "ctrl+c" {
			return m, tea.Quit
		}
	case hashDoneMsg:
		m.results = msg.results
		m.done = true
		return m, tea.Quit
	default:
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	}
	return m, nil
}

func (m SpinnerModel) View() tea.View {
	if m.done {
		return tea.NewView("")
	}
	noun := "checksums"
	if m.count == 1 {
		noun = "checksum"
	}
	return tea.NewView(fmt.Sprintf("%s Calculating %d %s for %q\n", m.spinner.View(), m.count, noun, m.filePath))
}
