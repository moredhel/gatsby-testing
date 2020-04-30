# Env to update Gemfile.lock / gemset.nix

with import <nixpkgs> {};
stdenv.mkDerivation {
  name = "env";
  buildInputs = [
    nodejs-12_x
  ];
}
