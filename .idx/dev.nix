{pkgs}: {
  packages = [
    # Core development tools
    pkgs.git
    pkgs.gnumake
    pkgs.curl
    pkgs.wget
    pkgs.unzip
    pkgs.jq

    # Node.js development
    pkgs.nodejs_22
    pkgs.yarn
    pkgs.nodePackages.typescript
    pkgs.nodePackages.ts-node
    pkgs.nodePackages.nodemon

    # Python for AI component
    pkgs.python312
    pkgs.poetry
    pkgs.python312Packages.pip
    pkgs.python312Packages.numpy
    pkgs.python312Packages.pandas
    pkgs.python312Packages.flask

    # Containerization
    pkgs.docker
    pkgs.docker-compose

    # Terraform for infrastructure
    pkgs.terraform
    
    # Database tools
    pkgs.mongodb
    
    # Useful development utilities
    pkgs.httpie
    pkgs.htop
    pkgs.neofetch
    pkgs.ncdu
    pkgs.ripgrep
  ];

  # Define shell hooks for setting up the environment
  enterShell = ''
    echo "Welcome to QuickAid development environment!"
    echo "Project structure:"
    echo "  - client/: React frontend"
    echo "  - server/: Node.js backend"
    echo "  - ai/: Python AI service"
    echo "  - terraform/: Infrastructure as Code"
    
    export NODE_OPTIONS="--max-old-space-size=4096"
    export PYTHONPATH="$PYTHONPATH:$PWD/ai"
    
    # Helper aliases
    alias dc="docker-compose"
    alias tf="terraform"
    alias client="cd client && npm run dev"
    alias server="cd server && npm run dev"
    alias ai="cd ai && python app.py"
    
    # Set up environment variables from .env if it exists
    if [ -f .env ]; then
      echo "Loading environment variables from .env"
      set -a
      source .env
      set +a
    fi
  '';

  # Define any repository-specific settings
  idx = {
    extensions = [
      "ms-python.python"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "hashicorp.terraform"
      "ms-azuretools.vscode-docker"
    ];
    
    workspace = {
      openFiles = [
        "README.md"
      ];
    };
  };
}