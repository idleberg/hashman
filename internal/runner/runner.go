package runner

import (
	"fmt"
	"time"

	tea "charm.land/bubbletea/v2"

	"github.com/idleberg/go-hashman/internal/algo"
	"github.com/idleberg/go-hashman/internal/hasher"
	"github.com/idleberg/go-hashman/internal/ui"
)

type Config struct {
	Algorithms []algo.Algorithm
	MaxWorkers int
	IsTTY      bool
}

func Run(cfg Config, files []string) error {
	maxDisplayLen := 0
	for _, a := range cfg.Algorithms {
		if len(a.Display) > maxDisplayLen {
			maxDisplayLen = len(a.Display)
		}
	}

	for i, filePath := range files {
		startTime := time.Now()

		var results []hasher.Result

		if cfg.IsTTY {
			hashFn := func() []hasher.Result {
				return hasher.HashFile(filePath, cfg.Algorithms, cfg.MaxWorkers)
			}
			model := ui.NewSpinnerModel(filePath, len(cfg.Algorithms), hashFn)
			p := tea.NewProgram(model)
			finalModel, err := p.Run()
			if err != nil {
				return fmt.Errorf("error processing %s: %w", filePath, err)
			}
			results = finalModel.(ui.SpinnerModel).Results()
		} else {
			results = hasher.HashFile(filePath, cfg.Algorithms, cfg.MaxWorkers)
		}

		totalDuration := time.Since(startTime)
		ui.PrintResults(filePath, results, totalDuration, maxDisplayLen)

		if i < len(files)-1 {
			ui.PrintSeparator()
		}
	}

	return nil
}
