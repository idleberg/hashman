package runner

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/idleberg/go-hashman/internal/algo"
)

func TestRunSingleFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.txt")
	if err := os.WriteFile(path, []byte("hello"), 0644); err != nil {
		t.Fatal(err)
	}

	cfg := Config{
		Algorithms: algo.Registry[:2],
		MaxWorkers: 2,
		IsTTY:      false,
	}

	if err := Run(cfg, []string{path}); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestRunMultipleFiles(t *testing.T) {
	dir := t.TempDir()
	var paths []string
	for _, name := range []string{"a.txt", "b.txt", "c.txt"} {
		p := filepath.Join(dir, name)
		if err := os.WriteFile(p, []byte(name), 0644); err != nil {
			t.Fatal(err)
		}
		paths = append(paths, p)
	}

	cfg := Config{
		Algorithms: algo.Registry[:1],
		MaxWorkers: 1,
		IsTTY:      false,
	}

	if err := Run(cfg, paths); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestRunNonexistentFile(t *testing.T) {
	cfg := Config{
		Algorithms: algo.Registry[:1],
		MaxWorkers: 1,
		IsTTY:      false,
	}

	err := Run(cfg, []string{"/nonexistent/file"})
	if err != nil {
		t.Fatalf("expected no Run error (file errors go into results), got: %v", err)
	}
}
