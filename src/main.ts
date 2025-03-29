#!/usr/bin/env bun

// This is the entry point of the project.
// It is executed when the user types `bn` in the terminal.
import { program } from './cli'

program.parse(Bun.argv)
