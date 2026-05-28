package main

import (
	"fmt"
	"os"
	"runtime"

	"github.com/mattn/go-isatty"
	"github.com/spf13/cobra"

	"github.com/idleberg/go-hashman/internal/algo"
	"github.com/idleberg/go-hashman/internal/runner"
	"github.com/idleberg/go-hashman/internal/ui"
)

var (
	Version   = "dev"
	allFlag   bool
	algoFlags = make(map[string]*bool)
)

func main() {
	rootCmd := &cobra.Command{
		Use:           "hashman [flags] <file> [file...]",
		Short:         "Calculate multiple hashes for files concurrently",
		Args:          cobra.MinimumNArgs(1),
		RunE:          run,
		Version:       Version,
		SilenceUsage:  true,
		SilenceErrors: true,
	}

	rootCmd.Flags().BoolVarP(&allFlag, "all", "A", false, "use all supported hashes")

	for _, a := range algo.Registry {
		b := false
		algoFlags[a.ID] = &b
		desc := fmt.Sprintf("create %s hash", a.Display)
		if a.Deprecated {
			desc += " (deprecated)"
		}
		rootCmd.Flags().BoolVar(algoFlags[a.ID], a.Flag, false, desc)
	}

	if err := rootCmd.Execute(); err != nil {
		ui.Logger.Error("%s", err)
		os.Exit(1)
	}
}

func run(cmd *cobra.Command, args []string) error {
	selected := resolveAlgorithms()
	if len(selected) == 0 {
		ui.Logger.Error("no hashing algorithm provided")
		fmt.Println()
		return cmd.Help()
	}

	cfg := runner.Config{
		Algorithms: selected,
		MaxWorkers: runtime.NumCPU(),
		IsTTY:      isTerminal(),
	}

	return runner.Run(cfg, args)
}

func resolveAlgorithms() []algo.Algorithm {
	var selected []algo.Algorithm
	for _, a := range algo.Registry {
		if allFlag {
			selected = append(selected, a)
		} else if b, ok := algoFlags[a.ID]; ok && *b {
			selected = append(selected, a)
		}
	}
	return selected
}

func isTerminal() bool {
	return isatty.IsTerminal(os.Stdout.Fd()) || isatty.IsCygwinTerminal(os.Stdout.Fd())
}
