package ui

import (
	"testing"
	"time"

	"github.com/idleberg/go-hashman/internal/algo"
	"github.com/idleberg/go-hashman/internal/hasher"
)

func fakeHashFunc(results []hasher.Result) HashFunc {
	return func() []hasher.Result {
		return results
	}
}

func TestNewSpinnerModel(t *testing.T) {
	fn := fakeHashFunc(nil)
	m := NewSpinnerModel("test.txt", 3, fn)

	if m.filePath != "test.txt" {
		t.Errorf("filePath = %q, want %q", m.filePath, "test.txt")
	}
	if m.count != 3 {
		t.Errorf("count = %d, want 3", m.count)
	}
	if m.done {
		t.Error("expected done to be false")
	}
}

func TestDoHashCallsInjectedFunction(t *testing.T) {
	expected := []hasher.Result{
		{Algorithm: algo.Registry[0], Hash: "abc123", Duration: time.Millisecond},
	}
	fn := fakeHashFunc(expected)
	m := NewSpinnerModel("test.txt", 1, fn)

	msg := m.doHash()
	done, ok := msg.(hashDoneMsg)
	if !ok {
		t.Fatalf("expected hashDoneMsg, got %T", msg)
	}
	if len(done.results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(done.results))
	}
	if done.results[0].Hash != "abc123" {
		t.Errorf("hash = %q, want %q", done.results[0].Hash, "abc123")
	}
}

func TestUpdateWithHashDoneMsg(t *testing.T) {
	expected := []hasher.Result{
		{Algorithm: algo.Registry[0], Hash: "def456", Duration: time.Millisecond},
	}
	m := NewSpinnerModel("test.txt", 1, fakeHashFunc(nil))

	updated, _ := m.Update(hashDoneMsg{results: expected})
	sm := updated.(SpinnerModel)

	if !sm.done {
		t.Error("expected done to be true after hashDoneMsg")
	}
	results := sm.Results()
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if results[0].Hash != "def456" {
		t.Errorf("hash = %q, want %q", results[0].Hash, "def456")
	}
}

func TestViewShowsCountAndFilePath(t *testing.T) {
	m := NewSpinnerModel("data.bin", 5, fakeHashFunc(nil))
	text := m.View().Content
	if text == "" {
		t.Fatal("expected non-empty view")
	}

	for _, want := range []string{"5", "checksums", "data.bin"} {
		if !contains(text, want) {
			t.Errorf("view missing %q: %s", want, text)
		}
	}
}

func TestViewSingularChecksum(t *testing.T) {
	m := NewSpinnerModel("file.txt", 1, fakeHashFunc(nil))
	text := m.View().Content

	if !contains(text, "1 checksum") {
		t.Errorf("expected singular 'checksum', got: %s", text)
	}
}

func TestViewEmptyWhenDone(t *testing.T) {
	m := NewSpinnerModel("test.txt", 1, fakeHashFunc(nil))
	m.done = true

	text := m.View().Content
	if text != "" {
		t.Errorf("expected empty view when done, got: %q", text)
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && searchString(s, substr)
}

func searchString(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
